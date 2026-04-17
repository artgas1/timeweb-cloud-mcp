import { BaseApiClient } from "./client";
import { CreateFloatingIpRequestDto } from "../types/dto/create-floating-ip-request.dto";
import { CreateFloatingIpResponseDto } from "../types/dto/create-floating-ip-response.dto";
import { CreateVpcRequestDto } from "../types/dto/create-vpc-request.dto";
import { CreateVpcResponseDto } from "../types/dto/create-vpc-response.dto";
import { CreateDatabaseRequestDto } from "../types/dto/create-database-request.dto";
import { CreateDatabaseResponseDto } from "../types/dto/create-database-response.dto";
import { Database } from "../types/database.type";
import {
  DatabasePreset,
  DatabasePresetsResponse,
} from "../types/database-preset.type";
import { AvailabilityZones } from "../types/availability-zones.enum";
import { CreateDbParams } from "../types/create-db-params.type";
import { Vpc } from "../types/vpc.type";
import { FloatingIp } from "../types/floating-ip.type";
import { GetVpcsResponseDto } from "../types/dto/get-vpcs-response.dto";
import { ListFloatingIpsResponseDto } from "../types/dto/list-floating-ips-response.dto";
import { GetFloatingIpResponseDto } from "../types/dto/get-floating-ip-response.dto";
import { UpdateFloatingIpRequestDto } from "../types/dto/update-floating-ip-request.dto";
import { UpdateFloatingIpResponseDto } from "../types/dto/update-floating-ip-response.dto";
import { BindFloatingIpRequestDto } from "../types/dto/bind-floating-ip-request.dto";
import { GetVpcResponseDto } from "../types/dto/get-vpc-response.dto";
import { UpdateVpcRequestDto } from "../types/dto/update-vpc-request.dto";
import { UpdateVpcResponseDto } from "../types/dto/update-vpc-response.dto";
import { ListVpcServicesResponseDto } from "../types/dto/list-vpc-services-response.dto";
import { ListVpcPortsResponseDto } from "../types/dto/list-vpc-ports-response.dto";
import { VpcService } from "../types/vpc-service.type";
import { VpcPort } from "../types/vpc-port.type";

export class DbaasApiClient extends BaseApiClient {
  /**
   * Создает новый floating IP адрес
   */
  async createFloatingIp(
    availabilityZone: AvailabilityZones,
    isDdosGuard: boolean = false
  ): Promise<FloatingIp> {
    const requestData: CreateFloatingIpRequestDto = {
      availability_zone: availabilityZone,
      is_ddos_guard: isDdosGuard,
    };

    const response = await this.post<CreateFloatingIpResponseDto>(
      "/api/v1/floating-ips",
      requestData
    );
    return response.ip;
  }

  /**
   * Получает список всех плавающих IP пользователя
   */
  async listFloatingIps(): Promise<ListFloatingIpsResponseDto> {
    return this.get<ListFloatingIpsResponseDto>("/api/v1/floating-ips");
  }

  /**
   * Получает информацию о плавающем IP по ID
   */
  async getFloatingIp(floatingIpId: string): Promise<FloatingIp> {
    const response = await this.get<GetFloatingIpResponseDto>(
      `/api/v1/floating-ips/${floatingIpId}`
    );
    return response.ip;
  }

  /**
   * Изменяет плавающий IP по ID (комментарий и/или PTR-запись)
   */
  async updateFloatingIp(
    floatingIpId: string,
    data: UpdateFloatingIpRequestDto
  ): Promise<FloatingIp> {
    const response = await this.patch<UpdateFloatingIpResponseDto>(
      `/api/v1/floating-ips/${floatingIpId}`,
      data
    );
    return response.ip;
  }

  /**
   * Удаляет плавающий IP по ID
   */
  async deleteFloatingIp(floatingIpId: string): Promise<void> {
    await this.delete<void>(`/api/v1/floating-ips/${floatingIpId}`);
  }

  /**
   * Привязывает плавающий IP к сервису (server/balancer/database/network)
   */
  async bindFloatingIp(
    floatingIpId: string,
    data: BindFloatingIpRequestDto
  ): Promise<void> {
    await this.post<void>(`/api/v1/floating-ips/${floatingIpId}/bind`, data);
  }

  /**
   * Отвязывает плавающий IP от сервиса
   */
  async unbindFloatingIp(floatingIpId: string): Promise<void> {
    await this.post<void>(`/api/v1/floating-ips/${floatingIpId}/unbind`);
  }

  /**
   * Получить список VPC пользователя
   */
  async getVpcs(): Promise<GetVpcsResponseDto> {
    return this.get<GetVpcsResponseDto>("/api/v2/vpcs");
  }

  /**
   * Создает новую виртуальную приватную сеть (VPC)
   */
  async createVpc(
    availabilityZone: AvailabilityZones,
    name: string,
    subnetV4: string
  ): Promise<Vpc> {
    const requestData: CreateVpcRequestDto = {
      availability_zone: availabilityZone,
      name: name,
      subnet_v4: subnetV4,
    };

    const response = await this.post<CreateVpcResponseDto>(
      "/api/v2/vpcs",
      requestData
    );
    return response.vpc;
  }

  /**
   * Получает VPC по ID
   */
  async getVpc(vpcId: string): Promise<Vpc> {
    const response = await this.get<GetVpcResponseDto>(`/api/v2/vpcs/${vpcId}`);
    return response.vpc;
  }

  /**
   * Изменяет VPC по ID (имя и/или описание)
   */
  async updateVpc(vpcId: string, data: UpdateVpcRequestDto): Promise<Vpc> {
    const response = await this.patch<UpdateVpcResponseDto>(
      `/api/v2/vpcs/${vpcId}`,
      data
    );
    return response.vpc;
  }

  /**
   * Удаляет VPC по ID
   */
  async deleteVpc(vpcId: string): Promise<void> {
    await this.delete<void>(`/api/v1/vpcs/${vpcId}`);
  }

  /**
   * Получает список сервисов в VPC
   */
  async listVpcServices(vpcId: string): Promise<VpcService[]> {
    const response = await this.get<ListVpcServicesResponseDto>(
      `/api/v2/vpcs/${vpcId}/services`
    );
    return response.services;
  }

  /**
   * Получает список портов VPC
   */
  async listVpcPorts(vpcId: string): Promise<VpcPort[]> {
    const response = await this.get<ListVpcPortsResponseDto>(
      `/api/v1/vpcs/${vpcId}/ports`
    );
    return response.vpc_ports;
  }

  /**
   * Создает новую базу данных
   */
  async createDatabase({
    name,
    type,
    presetId,
    availabilityZone,
    adminPassword,
    floatingIp,
    vpcId,
    hashType,
  }: CreateDbParams): Promise<Database> {
    const requestData: CreateDatabaseRequestDto = {
      admin: {
        password: adminPassword,
        for_all: false,
      },
      name: name,
      type: type,
      preset_id: presetId,
      availability_zone: availabilityZone,
      hash_type: hashType,
      auto_backups: {
        copy_count: 1,
        creation_start_at: new Date().toISOString(),
        interval: "day",
        day_of_week: 5,
      },
      network: {
        floating_ip: floatingIp,
        id: vpcId,
      },
    };

    const response = await this.post<CreateDatabaseResponseDto>(
      "/api/v1/databases",
      requestData
    );
    return response.db;
  }

  /**
   * Получает список пресетов баз данных
   */
  async getDatabasePresets(): Promise<DatabasePreset[]> {
    const response = await this.get<DatabasePresetsResponse>(
      "/api/v2/presets/dbs"
    );
    return response.databases_presets;
  }
}

export const dbaasApiClient: DbaasApiClient = new DbaasApiClient();
