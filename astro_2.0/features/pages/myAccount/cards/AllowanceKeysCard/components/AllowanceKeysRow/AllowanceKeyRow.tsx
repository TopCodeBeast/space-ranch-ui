import React, { FC, useCallback } from 'react';
import { useMedia } from 'react-use';

import { shortenString } from 'utils/format';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { AllowanceKeyModal } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeyModal';

import styles from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeysRow/AllowanceKeyRow.module.scss';
import { DaoWithAllowanceKey } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/types';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

interface Props {
  daoWithAllowanceKey: DaoWithAllowanceKey;
}

export const AllowanceKeyRow: FC<Props> = ({ daoWithAllowanceKey }) => {
  const isMobile = useMedia('(max-width: 640px)');

  const [showModal] = useModal(AllowanceKeyModal);

  const handleAssign = useCallback(async () => {
    await showModal({
      daoName: daoWithAllowanceKey.daoId,
    });
  }, [daoWithAllowanceKey.daoId, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.name}>
        <div className={styles.details}>
          <div className={styles.daoName}>{daoWithAllowanceKey.daoId}</div>
          <div className={styles.address}>
            <div className={styles.addressId}>
              {shortenString(daoWithAllowanceKey.daoId, isMobile ? 18 : 36)}
            </div>
            <CopyButton
              text={daoWithAllowanceKey.daoId}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            />
          </div>
        </div>
      </div>
      <div className={styles.control}>
        {daoWithAllowanceKey.allowanceKey ? (
          formatNearAmount(daoWithAllowanceKey.allowanceKey.allowance, 3)
        ) : (
          <Button size="small" capitalize onClick={handleAssign}>
            Request key
          </Button>
        )}
      </div>
    </div>
  );
};