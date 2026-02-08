import * as SecureStore from "expo-secure-store";

type VaultCredential = {
  id: string;
  serviceName: string;
  email: string;
  password: string;
  category: string;
  iconUri?: string | null;
};

type CredentialInput = Omit<VaultCredential, "id">;

const INDEX_KEY = "vault_index";
const ITEM_PREFIX = "vault_item_";

const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const readIndex = async () => {
  const raw = await SecureStore.getItemAsync(INDEX_KEY, SECURE_OPTIONS);
  if (!raw) {
    return [] as string[];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
};

const writeIndex = async (ids: string[]) => {
  await SecureStore.setItemAsync(
    INDEX_KEY,
    JSON.stringify(ids),
    SECURE_OPTIONS,
  );
};

export const saveCredential = async (input: CredentialInput) => {
  const id = createId();
  const payload: VaultCredential = { id, ...input };
  await SecureStore.setItemAsync(
    `${ITEM_PREFIX}${id}`,
    JSON.stringify(payload),
    SECURE_OPTIONS,
  );

  const index = await readIndex();
  if (!index.includes(id)) {
    index.push(id);
    await writeIndex(index);
  }

  return id;
};

export const getCredential = async (id: string) => {
  const raw = await SecureStore.getItemAsync(
    `${ITEM_PREFIX}${id}`,
    SECURE_OPTIONS,
  );
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as VaultCredential;
  } catch {
    return null;
  }
};

export const getAllCredentials = async () => {
  const index = await readIndex();
  const results: VaultCredential[] = [];

  for (const id of index) {
    const item = await getCredential(id);
    if (item) {
      results.push(item);
    }
  }

  return results;
};

export const deleteCredential = async (id: string) => {
  await SecureStore.deleteItemAsync(`${ITEM_PREFIX}${id}`, SECURE_OPTIONS);
  const index = await readIndex();
  const nextIndex = index.filter((value) => value !== id);
  await writeIndex(nextIndex);
};

export type { CredentialInput, VaultCredential };
