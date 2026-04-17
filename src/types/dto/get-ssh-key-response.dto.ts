import { SshKey } from "../ssh-key.type";

export interface GetSshKeyResponseDto {
  "ssh-key": SshKey;
  meta: { total: number };
}
