import React, { VFC } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import uniqBy from 'lodash/uniqBy';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';
import { DaoGroupLine } from 'astro_2.0/features/CreateDao/components/DaoGroupsForm/components/DaoGroupLine';

import styles from './DaoGroupsForm.module.scss';

type Form = { groups: { group: string; slug?: string }[] };

export const DaoGroupsForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<Form>({
    defaultValues: {
      groups: uniqBy(
        state.groups.items
          ? state.groups.items.map(item => ({
              slug: item?.slug,
              group: item.name,
            }))
          : [
              { group: 'All', slug: 'all' },
              { group: 'Councils', slug: 'councils' },
            ],
        item => item.group
      ),
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        groups: yup.array().of(
          yup.object().shape({
            group: yup.string().required('Required'),
          })
        ),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });

  const onSubmit = (data: Form) => {
    actions.updateAction({
      groups: {
        items: data.groups.map(item => ({
          slug: item?.slug,
          name: item.group,
        })),
        isValid,
      },
    });

    updateQuery('step', 'members');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.header}>
          <h2>{t('createDAO.daoGroupsForm.addGroups')}</h2>

          <StepCounter total={8} current={4} />
        </div>

        <p className={styles.description}>
          {t('createDAO.daoGroupsForm.addGroupsDescription')}
        </p>

        <div className={styles.row}>
          <div className={styles.column}>
            <h4 className={styles.subtitle}>
              {t('createDAO.daoGroupsForm.defaultGroup')}
            </h4>

            <p className={styles.caption}>
              {t('createDAO.daoGroupsForm.defaultGroupDescription')}
            </p>

            <section className={styles.links}>
              {fields.slice(0, 2).map((item, index) => {
                return (
                  <DaoGroupLine
                    key={item.id}
                    item={item}
                    index={index}
                    canBeRemoved={false}
                    onRemove={() => remove(index)}
                  />
                );
              })}
            </section>

            <h4 className={styles.subtitle}>
              {t('createDAO.daoGroupsForm.customGroup')}
            </h4>

            <section className={styles.links}>
              {fields.slice(1, -1).map((item, index) => {
                return (
                  <DaoGroupLine
                    key={item.id}
                    item={item}
                    index={index + 2}
                    onRemove={() => remove(index + 2)}
                  />
                );
              })}

              <Button
                className={styles.link}
                onClick={() => append({ group: '' })}
                variant="transparent"
              >
                <span className={styles.socialText} />

                <Icon className={styles.addBtn} name="buttonAdd" width={24} />
              </Button>
            </section>
          </div>

          <SubmitButton className={styles.submit} />
        </div>
      </form>
    </FormProvider>
  );
};