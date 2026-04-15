import { BaseApiClient } from "./client";
import { AccountStatus, Finances } from "../types/finances.type";
import { GetFinancesResponseDto } from "../types/dto/get-finances-response.dto";
import { GetAccountStatusResponseDto } from "../types/dto/get-account-status-response.dto";

export class AccountApiClient extends BaseApiClient {
  /**
   * Получает платёжную информацию аккаунта (баланс, тариф, автоплатёж)
   */
  async getFinances(): Promise<Finances> {
    const response = await this.get<GetFinancesResponseDto>(
      "/api/v1/account/finances"
    );
    return response.finances;
  }

  /**
   * Получает статус аккаунта (блокировка, уведомления, смена пароля)
   */
  async getStatus(): Promise<AccountStatus> {
    const response = await this.get<GetAccountStatusResponseDto>(
      "/api/v1/account/status"
    );
    return response.status;
  }
}

export const accountApiClient: AccountApiClient = new AccountApiClient();
