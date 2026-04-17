import { SshKey } from "../ssh-key.type";

export interface UpdateSshKeyResponseDto {
  "ssh-key": SshKey;
  meta: { total: number };
}
