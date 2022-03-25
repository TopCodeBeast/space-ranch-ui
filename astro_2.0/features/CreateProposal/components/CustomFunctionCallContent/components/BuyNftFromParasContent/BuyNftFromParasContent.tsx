import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './BuyNftFromParasContent.module.scss';

export const BuyNftFromParasContent: FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.tokenKey}>
        <InputWrapper fieldName="tokenKey" label="Token Key" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="5971:gambiarra.mintbase1.near"
            isBorderless
            size="block"
            {...register('tokenKey')}
          />
        </InputWrapper>
      </div>
      <div className={styles.gas}>
        <InputWrapper fieldName="actionsGas" label="TGas">
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={MIN_GAS}
              step={1}
              max={MAX_GAS}
              placeholder={`${DEFAULT_PROPOSAL_GAS}`}
              isBorderless
              size="block"
              {...register('actionsGas')}
            />
          </div>
        </InputWrapper>
      </div>
      <div className={styles.target}>
        <InputWrapper
          fieldName="target"
          label={t('proposalCard.proposalTarget')}
          flex
        >
          <Input
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder={t('proposalCard.proposalTargetPlaceholder')}
            isBorderless
            size="block"
            {...register('target')}
          />
        </InputWrapper>
      </div>
    </div>
  );
};
