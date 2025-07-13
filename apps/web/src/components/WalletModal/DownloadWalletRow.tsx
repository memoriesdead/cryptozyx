import { GooglePlayStoreLogo } from 'components/Icons/GooglePlayStoreLogo'
import { Wiggle } from 'components/animations/Wiggle'
import { useTranslation } from 'react-i18next'
import { Anchor, Flex, FlexProps, Text, TextProps, TouchableArea } from 'ui/src'
import { AppStoreLogo } from 'ui/src/components/icons/AppStoreLogo'
import { RightArrow } from 'ui/src/components/icons/RightArrow'
import { GoogleChromeLogo } from 'ui/src/components/logos/GoogleChromeLogo'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { Trace } from 'uniswap/src/features/telemetry/Trace'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { isMobileWeb, isWebAndroid, isWebIOS } from 'utilities/src/platform'

export function DownloadWalletRow({
  onPress,
  titleTextVariant = 'buttonLabel3',
  iconSize = 20,
  ...rest
}: {
  onPress: () => void
  titleTextVariant?: TextProps['variant']
  iconSize?: number
} & FlexProps) {
  const { t } = useTranslation()
  return (
    <TouchableArea onPress={onPress}>
      <Flex
        row
        justifyContent="center"
        alignItems="center"
        gap="$gap8"
        p="$spacing12"
        {...rest}
        $md={{ borderRadius: '$rounded20', mt: 0, p: '$spacing16', ...rest.$md }}
      >
        {/* <Text variant={titleTextVariant} color="$accent1" mr="auto" $md={{ variant: 'buttonLabel3' }}>
          {isMobileWeb ? t('common.getUniswapWallet.mobile') : t('common.getUniswapWallet')}
        </Text> */}
      </Flex>
    </TouchableArea>
  )
}
