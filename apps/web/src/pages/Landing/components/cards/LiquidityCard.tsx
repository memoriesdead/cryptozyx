import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { Bars } from 'pages/Landing/components/Icons'
import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { useTranslation } from 'react-i18next'

const primary = '#00D4AA' // Changed to teal/green for crypto rewards theme

export function LiquidityCard() {
  // const { t } = useTranslation()
  const { rive, RiveComponent } = useRive({
    src: '/rive/landing-page.riv',
    artboard: 'LP',
    stateMachines: 'Animation',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.CenterRight }),
  })

  return (
    <ValuePropCard
      href="#" // Placeholder for crypto rewards feature
      smaller
      color={primary}
      backgroundColor="rgba(0, 212, 170, 0.06)"
      $theme-dark={{
        backgroundColor: 'rgba(0, 212, 170, 0.12)',
      }}
      button={<PillButton color={primary} label="Crypto Rewards" icon={<Bars size="24px" fill={primary} />} />}
      titleText="Earn crypto rewards on every transaction. Social payment incentives."
      alignTextToBottom
    >
      <CardContents>
        <RiveComponent onMouseEnter={() => rive && rive.play()} />
      </CardContents>
    </ValuePropCard>
  )
}
