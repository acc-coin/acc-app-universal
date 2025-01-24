import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetContent,
} from '@gluestack-ui/themed';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useStores } from '../stores';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import 'mychips-react-sdk';
import { MCOfferwallSDK } from 'mychips-react-sdk';
import MAFViewer from '../components/MAFViewer';

const MAFActionSheet = observer(() => {
  const { t } = useTranslation();
  const { secretStore } = useStores();
  const [isSetUserId, setIsSetUserId] = useState(false);

  // useEffect(() => {
  //   if (!isSetUserId) {
  //     MCOfferwallSDK.setUserId(secretStore.address);
  //     setIsSetUserId(true);
  //   }
  //   console.log(
  //     '================= MAFActionSheet > setUserId:',
  //     secretStore.address,
  //   );
  // }, []);

  const handleClose = () =>
    secretStore.setShowMAFSheet(!secretStore.showMAFSheet);
  return (
    <Box>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Actionsheet isOpen={secretStore.showMAFSheet} onClose={handleClose}>
          <ActionsheetBackdrop bg='$borderLight200' />
          <ActionsheetContent bg='white' maxHeight='95%'>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack w='$full' h='90%' p={20}>
              <MAFViewer />
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      </KeyboardAvoidingView>
    </Box>
  );
});

export default MAFActionSheet;
