import { useMemo } from 'react'
import { FiatOnRampTransactionStatus, FiatOnRampTransactionType } from 'state/fiatOnRampTransactions/types'
import { ExternalLink } from 'ui/src/components/icons/ExternalLink'
import { UNISWAP_WEB_URL } from 'uniswap/src/constants/urls'
import { FORQuoteItem } from 'uniswap/src/features/fiatOnRamp/FORQuoteItem'
import { FORServiceProvider } from 'uniswap/src/features/fiatOnRamp/types'
import { v4 as uuid } from 'uuid'

import { useAddFiatOnRampTransaction } from 'state/fiatOnRampTransactions/hooks'
import { useFiatOnRampAggregatorTransferWidgetQuery } from 'uniswap/src/features/fiatOnRamp/api'

interface ProviderOptionProps {
  serviceProvider: FORServiceProvider
  walletAddress: string
  setConnectedProvider: (provider: FORServiceProvider) => void
  setErrorProvider: (provider: FORServiceProvider) => void
}

// Providers that should open their URLs directly instead of using the API widget
const DIRECT_LINK_PROVIDERS = ['RAMP', 'MOONPAY']

export function ProviderOption({
  walletAddress,
  serviceProvider,
  setConnectedProvider,
  setErrorProvider,
}: ProviderOptionProps) {
  const addFiatOnRampTransaction = useAddFiatOnRampTransaction()
  const externalTransactionId = useMemo(() => uuid(), [])

  const widgetQueryParams = useMemo(() => {
    return {
      serviceProvider: serviceProvider.serviceProvider,
      walletAddress,
      externalSessionId: externalTransactionId,
      redirectUrl: `${UNISWAP_WEB_URL}/buy`,
    }
  }, [walletAddress, serviceProvider, externalTransactionId])

  const isDirectLinkProvider = DIRECT_LINK_PROVIDERS.includes(serviceProvider.serviceProvider)

  // TODO(WEB-4417): use the widgetUrl from the /transfer-service-providers response instead of prefetching for every provider.
  const { data, error, isLoading } = useFiatOnRampAggregatorTransferWidgetQuery(widgetQueryParams, {
    skip: isDirectLinkProvider,
  })

  const handleProviderClick = async () => {
    if (isDirectLinkProvider) {
      // For direct link providers, open their URL directly
      window.open(serviceProvider.url, '_blank')
      setConnectedProvider(serviceProvider)
      addFiatOnRampTransaction({
        externalSessionId: externalTransactionId,
        account: walletAddress,
        status: FiatOnRampTransactionStatus.INITIATED,
        forceFetched: false,
        addedAt: Date.now(),
        type: FiatOnRampTransactionType.TRANSFER,
        syncedWithBackend: false,
        provider: serviceProvider.serviceProvider,
      })
    } else {
      // For API providers, use the widget URL
      if (data) {
        window.open(data.widgetUrl, '_blank')
        setConnectedProvider(serviceProvider)
        addFiatOnRampTransaction({
          externalSessionId: externalTransactionId,
          account: walletAddress,
          status: FiatOnRampTransactionStatus.INITIATED,
          forceFetched: false,
          addedAt: Date.now(),
          type: FiatOnRampTransactionType.TRANSFER,
          syncedWithBackend: false,
          provider: serviceProvider.serviceProvider,
        })
      } else if (error) {
        setErrorProvider(serviceProvider)
      }
    }
  }

  return (
    <FORQuoteItem
      key={serviceProvider.name}
      serviceProvider={serviceProvider}
      hoverIcon={<ExternalLink position="absolute" right="$spacing12" size={20} color="$neutral2" />}
      isLoading={!isDirectLinkProvider && isLoading}
      onPress={handleProviderClick}
    />
  )
}
