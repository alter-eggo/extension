import React, { Suspense } from 'react';
import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '@stacks/ui';

import { HIGH_FEE_AMOUNT_STX } from '@common/constants';
import { useDrawers } from '@common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { TransactionFormValues } from '@common/types';
import { isEmpty } from '@common/utils';
import { ShowEditNonceAction, ShowEditNoncePlaceholder } from '@components/show-edit-nonce';
import { useTransactionError } from '@pages/sign-transaction/hooks/use-transaction-error';
import { TransactionsSelectors } from '@tests/integration/transactions.selectors';

function BaseConfirmButton(props: ButtonProps): JSX.Element {
  return (
    <Button borderRadius="10px" py="base" type="submit" width="100%" {...props}>
      Confirm
    </Button>
  );
}

function SubmitActionSuspense(): JSX.Element {
  const { handleSubmit, values, validateForm } = useFormikContext<TransactionFormValues>();
  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const error = useTransactionError();

  const isDisabled = !!error;

  return (
    <BaseConfirmButton
      data-testid={TransactionsSelectors.BtnConfirmTransaction}
      onClick={async () => {
        // We need to check for errors here before we show the high fee confirmation
        const formErrors = await validateForm();
        if (isEmpty(formErrors) && values.txFee > HIGH_FEE_AMOUNT_STX) {
          return setShowHighFeeConfirmation(!showHighFeeConfirmation);
        }
        handleSubmit();
      }}
      isLoading={isLoading}
      isDisabled={isDisabled}
    >
      Confirm
    </BaseConfirmButton>
  );
}

export function SubmitAction(): JSX.Element {
  return (
    <>
      <Suspense fallback={<BaseConfirmButton isLoading isDisabled />}>
        <SubmitActionSuspense />
      </Suspense>
      <Suspense fallback={<ShowEditNoncePlaceholder />}>
        <ShowEditNonceAction />
      </Suspense>
    </>
  );
}
