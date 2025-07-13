import { useMemo } from 'react'
import { useFiatOnRampAggregatorTransferServiceProvidersQuery } from 'uniswap/src/features/fiatOnRamp/api'
import { FORServiceProvider } from 'uniswap/src/features/fiatOnRamp/types'

// Additional providers to add alongside API providers
const ADDITIONAL_PROVIDERS: FORServiceProvider[] = [
  {
    serviceProvider: 'RAMP',
    name: 'Ramp',
    url: 'https://ramp.network',
    logos: {
      darkLogo: 'https://ramp.network/assets/images/ramp-logo-dark.svg',
      lightLogo: 'https://ramp.network/assets/images/ramp-logo-light.svg',
    },
    paymentMethods: ['Credit Card', 'Debit Card', 'Bank Transfer'],
    supportUrl: 'https://support.ramp.network',
  },
  {
    serviceProvider: 'MOONPAY',
    name: 'MoonPay',
    url: 'https://moonpay.com',
    logos: {
      darkLogo: 'https://moonpay.com/assets/images/moonpay-logo-dark.svg',
      lightLogo: 'https://moonpay.com/assets/images/moonpay-logo-light.svg',
    },
    paymentMethods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
    supportUrl: 'https://support.moonpay.com',
  },
]

export function useCexTransferProviders(params?: { isDisabled?: boolean }): FORServiceProvider[] {
  const { data } = useFiatOnRampAggregatorTransferServiceProvidersQuery(undefined, {
    skip: params?.isDisabled,
  })

  return useMemo(() => {
    if (!data) {
      return ADDITIONAL_PROVIDERS
    }

    // Combine API providers with additional providers, avoiding duplicates
    const apiProviders = data.serviceProviders
    const existingProviderIds = new Set(apiProviders.map(p => p.serviceProvider))
    const additionalProviders = ADDITIONAL_PROVIDERS.filter(p => !existingProviderIds.has(p.serviceProvider))

    return [...apiProviders, ...additionalProviders]
  }, [data])
}
