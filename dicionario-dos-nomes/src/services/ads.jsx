import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-5781907132925477/9911463270';

export const setupAppOpenAd = () => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  appOpenAd.load();

  const onLoaded = () => {
    try {
      appOpenAd.show();
    } catch (e) {
      console.log('Erro ao mostrar anúncio:', e);
    }
  };

  const onError = (e) => {
    console.log('Erro ao carregar anúncio:', e);
  };

  appOpenAd.addAdEventListener(AdEventType.LOADED, onLoaded);
  appOpenAd.addAdEventListener(AdEventType.ERROR, onError);

  return () => {
    appOpenAd.removeAllListeners();
  };
};
