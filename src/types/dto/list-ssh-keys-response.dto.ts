import { SshKey } from "../ssh-key.type";

export interface ListSshKeysResponseDto {
  "ssh-keys": SshKey[];
  meta: { total: number };
}
