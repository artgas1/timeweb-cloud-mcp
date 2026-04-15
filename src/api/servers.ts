import { BaseApiClient } from "./client";
import { Server } from "../types/server.type";
import { ServerLog } from "../types/server-log.type";
import { ServerBackup } from "../types/server-backup.type";
import { ListServersResponseDto } from "../types/dto/list-servers-response.dto";
import { GetServerResponseDto } from "../types/dto/get-server-response.dto";
import { GetServerLogsResponseDto } from "../types/dto/get-server-logs-response.dto";
import { ListServerDiskBackupsResponseDto } from "../types/dto/list-server-disk-backups-response.dto";
import { CreateServerDiskBackupResponseDto } from "../types/dto/create-server-disk-backup-response.dto";

export type ServerLogsOrder = "asc" | "desc";

export class ServersApiClient extends BaseApiClient {
  /**
   * Получает список всех серверов аккаунта
   */
  async listServers(): Promise<Server[]> {
    const response = await this.get<ListServersResponseDto>("/api/v1/servers");
    return response.servers;
  }

  /**
   * Получает детальную информацию по одному серверу
   */
  async getServer(serverId: number): Promise<Server> {
    const response = await this.get<GetServerResponseDto>(
      `/api/v1/servers/${serverId}`
    );
    return response.server;
  }

  /**
   * Запускает выключенный сервер
   */
  async startServer(serverId: number): Promise<void> {
    await this.post<void>(`/api/v1/servers/${serverId}/start`);
  }

  /**
   * Выполняет мягкое выключение сервера через ACPI shutdown
   */
  async shutdownServer(serverId: number): Promise<void> {
    await this.post<void>(`/api/v1/servers/${serverId}/shutdown`);
  }

  /**
   * Перезагружает сервер через ACPI (мягкая перезагрузка)
   */
  async rebootServer(serverId: number): Promise<void> {
    await this.post<void>(`/api/v1/servers/${serverId}/reboot`);
  }

  /**
   * Получает список событий жизненного цикла сервера
   */
  async getServerLogs(
    serverId: number,
    order: ServerLogsOrder = "desc"
  ): Promise<ServerLog[]> {
    const response = await this.get<GetServerLogsResponseDto>(
      `/api/v1/servers/${serverId}/logs?order=${order}`
    );
    return response.server_logs;
  }

  /**
   * Получает список бэкапов диска сервера
   */
  async listServerDiskBackups(
    serverId: number,
    diskId: number
  ): Promise<ServerBackup[]> {
    const response = await this.get<ListServerDiskBackupsResponseDto>(
      `/api/v1/servers/${serverId}/disks/${diskId}/backups`
    );
    return response.backups;
  }

  /**
   * Создаёт ручной бэкап диска сервера
   */
  async createServerDiskBackup(
    serverId: number,
    diskId: number,
    comment?: string
  ): Promise<ServerBackup> {
    const response = await this.post<CreateServerDiskBackupResponseDto>(
      `/api/v1/servers/${serverId}/disks/${diskId}/backups`,
      comment ? { comment } : {}
    );
    return response.backup;
  }

  /**
   * Удаляет бэкап диска сервера
   */
  async deleteServerDiskBackup(
    serverId: number,
    diskId: number,
    backupId: number
  ): Promise<void> {
    await this.delete<void>(
      `/api/v1/servers/${serverId}/disks/${diskId}/backups/${backupId}`
    );
  }
}

export const serversApiClient: ServersApiClient = new ServersApiClient();
