import React, { FC } from 'react';
import { useFlagCropper } from 'features/create-dao/components/create-flag/FlagCropper';
import { Button } from 'components/button/Button';

import styles from './flag-tab.module.scss';

interface FlagTabProps {
  onChange: (name: string, value: string) => void;
  viewMode: boolean;
  daoFlag?: string;
}

const FlagTab: FC<FlagTabProps> = ({ viewMode, onChange, daoFlag }) => {
  const { node, crop, canvasRef } = useFlagCropper({
    src: '/flags/flag-1.svg',
    dragMode: false
  });

  const handleCrop = () => {
    crop();
    onChange('daoFlag', canvasRef.current?.toDataURL('image/png') ?? '');
  };

  return (
    <div className={styles.root}>
      {viewMode ? (
        <div className={styles.preview}>
          <div>
            {daoFlag
              ? 'Your DAO flag. It looks great!'
              : 'You have no DAO flag yet. Time to create one!'}
          </div>
          <div className="images-container">
            {daoFlag && (
              // eslint-disable-next-line
              <img alt="Result" width={300} height={300} src={daoFlag} />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.edit}>
          <div className={styles.cropper}>
            <style jsx>{`
              .root {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 24px;
                height: 100%;
                width: 100%;
              }

              .cropper-container {
                width: 100%;
                flex-basis: 100%;
              }

              .images-container {
                height: 300px;
                width: 100%;
                display: flex;
                justify-content: center;
                gap: 1rem;
              }

              #mask-test {
                width: 300px;
                height: 300px;
                outline: 1px solid lightslategray;
              }
            `}</style>
            <div className="cropper-container">{node}</div>
          </div>
          <div className={styles.btn}>
            <Button size="small" onClick={handleCrop}>
              Crop!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlagTab;