import React, { useEffect, useState } from 'react';
import {
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
  Button,
  Switch,
  Textarea,
  TextareaInput,
  FormControlHelper,
  FormControlHelperText,
  ButtonGroup,
  Box,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@gluestack-ui/themed';
import { ChevronDownIcon } from 'lucide-react-native';
import { useStores } from '../stores';
import { observer } from 'mobx-react';
import { truncateMiddleString, truncateString } from '../utils/convert';
import { getLocales } from 'expo-localization';

const ImportPrivateKey = observer(
  ({ saveKey, fromOtherWallet, afterSelectingShop, client }) => {
    const [privateKey, setPrivateKey] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [shopIds, setShopIds] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState([]);
    useEffect(() => {
      console.log('get shop list');
      async function getList() {
        const length = await client.shop.getShopsCount();
        if (length > 0) {
          const shopList = await client.shop.getShops(0, length.toNumber());
          console.log('shopList :', shopList);
          // has shop list
          setShopIds(shopList);
          await saveShopInfo(shopList[0]);
        } else {
          // no shop list
          //// set list empty string
          setShopIds([]);
          //// notice no shop so you should create new wallet.
        }
      }
      if (client) getList();
    }, [fromOtherWallet, client]);

    const { userStore } = useStores();
    const onPressShop = async (id) => {
      console.log('onPressCurrency > shopId:', id);
      await saveShopInfo(id);
    };

    const saveShopInfo = async (id) => {
      // get shop info
      setSelectedShopId(id);
      const info = await client.shop.getShopInfo(id);
      console.log('shop info : ', info);
      const deviceLocales = getLocales()[0];
      console.log('deviceLocales :', deviceLocales);
      userStore.setShopId(info.shopId);
      userStore.setShopName(info.name);
      userStore.setLang(deviceLocales.languageCode.toLowerCase());
      userStore.setCountry(deviceLocales.regionCode.toLowerCase());
      userStore.setLangTag(deviceLocales.languageTag);
      userStore.setCountryPhoneCode(
        deviceLocales.regionCode == 'KR' ? '82' : '82',
      );
    };

    const onPressSelectShop = async () => {
      // save selcted shop info to userStore
      await afterSelectingShop();
    };

    return (
      <Box>
        <Button
          py='$2.5'
          px='$3'
          onPress={() => {
            setShowModal(true);
          }}>
          <ButtonText>다른 지갑 불러오기</ButtonText>
        </Button>
        {fromOtherWallet === true ? (
          shopIds.length > 0 ? (
            <Box my='$5'>
              <FormControl size='md' isRequired={true}>
                <FormControlLabel mb='$1'>
                  <FormControlLabelText>상점 목록</FormControlLabelText>
                </FormControlLabel>
                <Select
                  onValueChange={onPressShop}
                  selectedValue={
                    shopIds ? truncateMiddleString(shopIds[0], 12) : ''
                  }
                  selectedLabel={
                    shopIds ? truncateMiddleString(shopIds[0], 12) : ''
                  }>
                  <SelectTrigger>
                    <SelectInput placeholder='Select option' />
                    <SelectIcon mr='$3'>
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {shopIds.map((id) => {
                        return (
                          <SelectItem
                            key={id}
                            label={truncateMiddleString(id.toString(), 12)}
                            value={id}
                          />
                        );
                      })}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <Button
                  my='$2.5'
                  px='$3'
                  onPress={() => {
                    onPressSelectShop();
                  }}>
                  <ButtonText>상점 선택</ButtonText>
                </Button>
              </FormControl>
            </Box>
          ) : (
            <Text size='sm'>
              상점을 찾을 수 없습니다. 새로운 지갑을 생성해 주세요.
            </Text>
          )
        ) : null}
        <Modal
          avoidKeyboard={true}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}>
          <ModalBackdrop />
          <ModalContent maxWidth='$96'>
            <ModalBody p='$5'>
              <VStack space='xs' mb='$4'>
                <Heading>지갑 가져오기</Heading>
                <Text size='sm'>
                  사용하던 기기에서 복사한 비공개 키를 아래 빈 칸에
                  입력해주세요. 사용하시던 지갑을 이 기기에서도 그대로 사용이
                  가능합니다.
                </Text>
              </VStack>
              <VStack py='$2' space='xl'>
                <FormControl>
                  <FormControlHelper>
                    <FormControlHelperText>
                      여기에 비공개 키 문자열을 붙여넣으세요.
                    </FormControlHelperText>
                  </FormControlHelper>

                  <Input>
                    <InputField
                      value={privateKey}
                      onChangeText={setPrivateKey}
                    />
                  </Input>

                  {/*<Textarea*/}
                  {/*  size='md'*/}
                  {/*  isReadOnly={false}*/}
                  {/*  isInvalid={false}*/}
                  {/*  isDisabled={false}*/}
                  {/*  w='$64'>*/}
                  {/*  <TextareaInput*/}
                  {/*    placeholder='Your text goes here...'*/}
                  {/*    value={privateKey}*/}
                  {/*    onChangeText={setPrivateKey}*/}
                  {/*  />*/}
                  {/*</Textarea>*/}
                </FormControl>
              </VStack>

              <ButtonGroup space='md' alignSelf='center'>
                <Button
                  variant='outline'
                  py='$2.5'
                  action='secondary'
                  onPress={() => {
                    setShowModal(false);
                    setPrivateKey('');
                  }}>
                  <ButtonText fontSize='$sm' fontWeight='$medium'>
                    No
                  </ButtonText>
                </Button>
                <Button
                  variant='solid'
                  bg='$success700'
                  borderColor='$success700'
                  onPress={() => {
                    setShowModal(false);
                    saveKey(privateKey);
                    setPrivateKey('');
                  }}>
                  <ButtonText fontSize='$sm' fontWeight='$medium'>
                    Yes
                  </ButtonText>
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  },
);

export default ImportPrivateKey;