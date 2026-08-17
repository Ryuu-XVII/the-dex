import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { type Profile, type RelationshipStatus, type Lie } from "@/components/hoekedex/types";
import { useAuthUser } from "./use-auth-user";

function toDateString(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().split("T")[0];
  }
  return typeof value === "string" ? value : "";
}

function toProfile(id: string, raw: Record<string, unknown>): Profile {
  return {
    ...raw,
    id,
    lastUpdated: toDateString(raw.lastUpdated),
  } as Profile;
}

export function useProfiles() {
  const { user, loading: authLoading } = useAuthUser();
  const userId = user?.uid ?? null;
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "profiles"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => toProfile(doc.id, doc.data()))
          .filter((p) => !p.hidden);

        // Local sort by lastUpdated (since we don't have an index yet for compound query)
        data.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

        setProfiles(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId, authLoading]);

  const addProfile = async (data: {
    name: string;
    age?: string;
    status: RelationshipStatus;
    rating: number;
    notes: string;
    photoFile?: File;
  }) => {
    if (!userId) return;

    const ageNum = data.age ? Number(data.age) : undefined;

    // Create the profile first so a photo-upload failure (e.g. Storage not
    // provisioned, network hiccup) never blocks the rest of the entry from saving.
    const docRef = await addDoc(collection(db, "profiles"), {
      userId,
      name: data.name,
      ...(ageNum !== undefined && !Number.isNaN(ageNum) ? { age: ageNum } : {}),
      status: data.status,
      rating: data.rating,
      notes: data.notes,
      lastUpdated: serverTimestamp(),
      lies: [],
    });

    if (data.photoFile) {
      try {
        const path = `profile-photos/${userId}/${crypto.randomUUID()}-${data.photoFile.name}`;
        const photoRef = ref(storage, path);
        await uploadBytes(photoRef, data.photoFile);
        const photoUrl = await getDownloadURL(photoRef);
        await updateDoc(docRef, { photo: photoUrl });
      } catch (err) {
        console.error("Photo upload failed, profile saved without photo:", err);
      }
    }
  };

  const addLie = async (profileId: string, lie: Omit<Lie, "id">) => {
    const newLie = { ...lie, id: crypto.randomUUID() };

    await updateDoc(doc(db, "profiles", profileId), {
      lies: arrayUnion(newLie),
      lastUpdated: serverTimestamp(),
    });
  };

  return { profiles, loading: loading || authLoading, addProfile, addLie, userId };
}

export function useAllProfiles() {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "profiles");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => toProfile(doc.id, doc.data()));
        setAllProfiles(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return { allProfiles, loading };
}

// Admin moderation actions. Enforced server-side by firestore.rules (owner or admin only).
export async function setProfileHidden(profileId: string, hidden: boolean) {
  await updateDoc(doc(db, "profiles", profileId), { hidden });
}

export async function removeProfile(profileId: string) {
  await deleteDoc(doc(db, "profiles", profileId));
}
