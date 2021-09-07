import get from 'lodash.get';

import { DAO } from 'types/dao';

import { yoktoNear } from 'services/SputnikService/constants';
import Decimal from 'decimal.js';

export type DaoPermission =
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove';

export type DaoRole = {
  createdAt: string;
  id: string;
  name: string;
  kind: 'Everyone' | 'Group';
  balance: null;
  accountIds: string[] | null;
  permissions: DaoPermission[];
  votePolicy: null;
};

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
};

export type DaoPolicy = {
  createdAt: string;
  daoId: string;
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: string;
  bountyForgivenessPeriod: string;
  defaultVotePolicy: DaoVotePolicy;
  roles: DaoRole[];
};

type DaoConfig = {
  name: string;
  purpose: string;
  metadata: string;
};

export type DaoDTO = {
  createdAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: string;
  updateTimestamp: string;
  id: string;
  config: DaoConfig;
  amount: string;
  totalSupply: string;
  lastBountyId: number;
  lastProposalId: number;
  numberOfProposals: number;
  stakingContract: string;
  numberOfMembers: number;
  council: string[];
  councilSeats: number;
  link: unknown | null;
  description: string | null;
  status: 'Success';
  policy: DaoPolicy;
};

export const mapDaoDTOtoDao = (daoDTO: DaoDTO): DAO => {
  // Calculate DAO members count
  const roles = get(daoDTO, 'policy.roles', []);
  // const councilRole = roles.find((item: DaoRole) => item.name === 'council');
  const numberOfMembers = get(daoDTO, 'numberOfMembers', 0);

  // Transform amount
  const amountYokto = new Decimal(daoDTO.amount);
  const funds = amountYokto.div(yoktoNear).toFixed(2);

  // Get DAO groups
  const daoGroups = roles
    .filter((item: DaoRole) => item.kind === 'Group')
    .map((item: DaoRole) => {
      return {
        members: item.accountIds,
        name: item.name,
        permissions: item.permissions,
        votePolicy: item.votePolicy,
        slug: item.name
      };
    });

  // DAO config
  const config = get(daoDTO, 'config');

  return {
    id: daoDTO.id,
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    members: numberOfMembers,
    proposals: 18,
    // TODO - where can we get DAO logo flag?
    logo: 'https://i.imgur.com/t5onQz9.png',
    funds,
    createdAt: daoDTO.createdAt,
    groups: daoGroups
  };
};

export const mapDaoDTOListToDaoList = (daoList: DaoDTO[]): DAO[] => {
  return daoList.map(daoItem => {
    return mapDaoDTOtoDao(daoItem);
  });
};