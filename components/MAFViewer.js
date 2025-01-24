import React, { useEffect, useState } from 'react';
import { MCOfferwallSDK,MCOfferwallView} from 'mychips-react-sdk';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import { Platform } from 'react-native';
const MAFViewer = observer(({ }) => {
  const { secretStore } = useStores();
  const [unitId, setUnitId] = useState('');

  useEffect(() => {
    const network = secretStore.network;
    const os = Platform.OS;

    MCOfferwallSDK.setUserId(secretStore.address);

    setUnitId(
      os === 'ios'
        ? network === 'mainnet'
          ? process.env.EXPO_PUBLIC_ACC_IOS_MAINNET_ID
          : process.env.EXPO_PUBLIC_ACC_IOS_TESTNET_ID
        : network === 'mainnet'
        ? process.env.EXPO_PUBLIC_ACC_ANDROID_MAINNET_ID
        : process.env.EXPO_PUBLIC_ACC_ANDROID_TESTNET_ID,
    );
    console.log('================= MAFViewer > unitId', unitId);
  }, [secretStore.network, Platform.OS]);

  // useEffect(() => {
  //   MCOfferwallSDK.getUserId().then((userId) => {
  //     console.log('================= MAFViewer > getUserId:', userId);
  //   });
  // }, []);

  console.log('================= MAFViewer > unitId:', unitId);
  return unitId ? (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <MCOfferwallView adunitId={unitId} />
      </View>
    </View>
  ) : null;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
  },
});

export default MAFViewer;
