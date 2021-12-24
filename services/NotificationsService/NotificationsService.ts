import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { PaginationResponse } from 'types/api';
import {
  Notification,
  NotificationDTO,
  UpdateNotificationParams,
  UpdateNotificationSettingsParams,
} from 'types/notification';

import { httpService } from 'services/HttpService';
import { SputnikNearService } from 'services/sputnik';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import { NotificationSettingDTO } from 'services/NotificationsService/types';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  private readonly sputnikNearService = SputnikNearService;

  public async getNotifications(
    showArchived: boolean
  ): Promise<Notification[]> {
    const offset = 0;
    const limit = 3000;
    const sort = 'createdAt,DESC';

    const accountId = this.sputnikNearService.getAccountId();

    if (!accountId) {
      return Promise.resolve([]);
    }

    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'accountId',
        operator: '$eq',
        value: accountId,
      })
      .setFilter({
        field: 'isArchived',
        operator: '$eq',
        value: showArchived,
      })
      .query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationDTO[]>
    >(`/account-notifications?${queryString}`, {
      params: {
        offset,
        limit,
        sort,
      },
    });

    return mapNotificationDtoToNotification(response.data.data);
  }

  public async updateNotification(
    id: string,
    params: UpdateNotificationParams
  ): Promise<NotificationDTO> {
    const response = await this.httpService.patch<
      UpdateNotificationParams,
      NotificationDTO
    >(`/account-notifications/${id}`, params);

    return response;
  }

  public async getNotificationsSettings(
    daosIds?: string[]
  ): Promise<NotificationSettingDTO[]> {
    if (daosIds && daosIds.length === 0) {
      return [];
    }

    const offset = 0;
    const limit = 1000;
    const sort = 'createdAt,DESC';

    const accountId = this.sputnikNearService.getAccountId();

    const query = RequestQueryBuilder.create().setFilter({
      field: 'accountId',
      operator: '$eq',
      value: accountId,
    });

    if (!daosIds) {
      query.setFilter({
        field: 'daoId',
        operator: '$isnull',
      });
    }

    const queryString = query.query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationSettingDTO[]>
    >(`/notification-settings?${queryString}`, {
      params: {
        offset,
        limit,
        sort,
      },
    });

    return response.data.data;
  }

  public async updateNotificationSettings(
    params: UpdateNotificationSettingsParams
  ): Promise<NotificationSettingDTO> {
    return this.httpService.post<
      UpdateNotificationSettingsParams,
      NotificationSettingDTO
    >(`/notification-settings`, params);
  }
}

export const NotificationsService = new NotificationsServiceClass();