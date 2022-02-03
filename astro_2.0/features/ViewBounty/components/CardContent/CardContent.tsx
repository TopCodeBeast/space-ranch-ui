import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { useIsValidImage } from 'hooks/useIsValidImage';
import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { formatYoktoValue } from 'utils/format';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import styles from './CardContent.module.scss';

interface CardContentProps {
  amount: string;
  deadlineThreshold: string;
  token: string;
}

export const CardContent: FC<CardContentProps> = ({
  amount,
  deadlineThreshold,
  token,
}) => {
  const { t } = useTranslation();

  const { tokens } = useCustomTokensContext();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  const isValid = useIsValidImage(tokenData?.icon);

  function renderIcon() {
    if (tokenData?.symbol === 'NEAR') {
      return <Icon name="tokenNearBig" />;
    }

    if (isValid) {
      return (
        <div
          style={{
            backgroundImage: `url(${tokenData.icon})`,
          }}
          className={styles.icon}
        />
      );
    }

    return <div className={styles.icon} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.inline}>
        <FieldWrapper label={t('proposalCard.proposalAmount')}>
          {tokenData ? (
            <FieldValue value={formatYoktoValue(amount, tokenData.decimals)} />
          ) : (
            <div className={styles.loaderWrapper}>
              <LoadingIndicator />
            </div>
          )}
        </FieldWrapper>
        <FieldWrapper label="">
          <div className={styles.row}>
            {tokenData && (
              <>
                <div className={styles.iconWrapper}>{renderIcon()}</div>
                <div className={styles.symbol}>{tokenData.symbol}</div>
              </>
            )}
          </div>
        </FieldWrapper>
      </div>
      <div className={styles.divider} />
      <div className={styles.inline}>
        <FieldWrapper label="Grace">
          <FieldValue value={`${deadlineThreshold} days`} />
        </FieldWrapper>
      </div>
    </div>
  );
};