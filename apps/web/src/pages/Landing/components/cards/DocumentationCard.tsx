import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useState, useEffect, useCallback } from 'react'
import { CodeBrackets } from 'pages/Landing/components/Icons'
import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { Flex, Text, TouchableArea } from 'ui/src'
import { validColor } from 'ui/src/theme'

const primary = '#FF6B35' // Orange for crypto payments theme
const secondary = '#FF8C5A' // Lighter orange for gradients

// Animation configurations with enhanced interactivity
const animations = [
  {
    id: 'like-heart',
    name: 'Like Heart',
    src: '/rive/community/like-dislike-heart.riv',
    overlayText: '💖 Pay Friends',
    emoji: '💖',
    description: 'Send love with payments',
    color: '#FF6B9D',
    fallback: true
  },
  {
    id: 'animated-emojis',
    name: 'Happy Emojis',
    src: '/rive/community/animated-emojis.riv',
    overlayText: '😊 Send Money',
    emoji: '😊',
    description: 'Express yourself while paying',
    color: '#FFD93D',
    fallback: true
  },
  {
    id: 'sci-fi-popup',
    name: 'Crypto Future',
    src: '/rive/community/sci-fi-popup.riv',
    overlayText: '🚀 Crypto Pay',
    emoji: '🚀',
    description: 'Future of digital payments',
    color: '#6C5CE7',
    fallback: true
  },
  {
    id: 'working-fallback',
    name: 'Crypto Payments',
    src: '/rive/landing-page.riv',
    artboard: 'LP',
    stateMachines: 'Animation',
    overlayText: '💰 Crypto Pay',
    emoji: '💰',
    description: 'Secure crypto transactions',
    color: primary,
    fallback: false
  }
]

export function DocumentationCard() {
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const animation = animations[currentAnimation]
  
  // Rive configuration with enhanced error handling
  const riveConfig = {
    src: animation.src,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    autoplay: true,
    ...(animation.artboard && { artboard: animation.artboard }),
    ...(animation.stateMachines && { stateMachines: animation.stateMachines }),
  }
  
  const { rive, RiveComponent } = useRive(riveConfig)

  // Enhanced animation switching with smooth transitions
  const nextAnimation = useCallback(() => {
    setCurrentAnimation((prev) => (prev + 1) % animations.length)
    setHasError(false)
    
    // Trigger animation play on switch
    setTimeout(() => {
      if (rive) {
        rive.play()
        setIsPlaying(true)
      }
    }, 100)
  }, [rive])

  // Manual click handler for user interactions
  const handleManualClick = useCallback(() => {
    setClickCount(prev => prev + 1)
    nextAnimation()
    
    // Reset click count after 3 seconds
    setTimeout(() => {
      setClickCount(0)
    }, 3000)
  }, [nextAnimation])

  // Auto-play animations with interaction
  const handleAnimationInteraction = useCallback(() => {
    if (rive) {
      rive.play()
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }, [rive])

  // Auto-switch to fallback if community animation fails
  useEffect(() => {
    if (hasError && animation.fallback) {
      const fallbackIndex = animations.findIndex(anim => !anim.fallback)
      if (fallbackIndex !== -1) {
        setCurrentAnimation(fallbackIndex)
        setHasError(false)
      }
    }
  }, [hasError, animation.fallback])

  // Monitor for animation errors with retry logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!rive && animation.fallback) {
        setHasError(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [rive, animation.fallback])

  // Auto-cycle animations every 8 seconds when not hovered
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        nextAnimation()
      }, 8000)
      
      return () => clearInterval(interval)
    }
    
    // Return empty cleanup function when hovered
    return () => {}
  }, [isHovered, nextAnimation])

  return (
    <ValuePropCard
      smaller
      backgroundColor={validColor(`rgba(255, 107, 53, 0.06)`)}
      $theme-dark={{
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
      }}
      href="#"
      color={primary}
      button={
        <PillButton 
          color={primary} 
          label="Social Payments" 
          icon={<CodeBrackets size="24px" fill={primary} />} 
        />
      }
      titleText="Send crypto like Venmo. Multi-chain instant settlements."
      alignTextToBottom
      pr="25%"
      $sm={{
        pr: "20%",
      }}
      $xs={{
        pr: "15%",
      }}
    >
      <CardContents>
        <Flex
          width={260}
          height={200}
          alignItems="center"
          justifyContent="center"
          position="relative"
          borderRadius="$rounded24"
          mr="$spacing24"
          overflow="hidden"
          cursor="pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPress={handleAnimationInteraction}
          style={{
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Dynamic gradient background */}
          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="$rounded16"
            opacity={isHovered ? 0.8 : 0.6}
            style={{
              background: `linear-gradient(135deg, ${animation.color}20, ${primary}30, ${secondary}20)`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.4s ease-in-out',
            }}
          />
          
          {/* Animated border */}
          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="$rounded24"
            borderWidth={2}
            borderColor={isHovered ? animation.color : primary}
            style={{
              transition: 'border-color 0.3s ease-in-out',
              background: isHovered 
                ? `linear-gradient(45deg, ${animation.color}40, transparent, ${primary}40)`
                : 'transparent',
            }}
          />

          {/* Animation container with enhanced effects */}
          <Flex 
            width="100%" 
            height="100%" 
            alignItems="center" 
            justifyContent="center"
            position="relative"
            zIndex={2}
          >
            {rive ? (
              <RiveComponent 
                onMouseEnter={handleAnimationInteraction}
                onClick={handleAnimationInteraction}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: isPlaying ? 'brightness(1.1) saturate(1.2)' : 'brightness(1)',
                  transition: 'filter 0.3s ease-in-out',
                }}
              />
            ) : (
              // Enhanced loading/fallback state
              <Flex alignItems="center" justifyContent="center" gap="$spacing12">
                <Text 
                  fontSize={48} 
                  color={animation.color}
                  style={{
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  {animation.emoji}
                </Text>
                <Flex alignItems="center" gap="$spacing4">
                  <Text variant="body2" color={animation.color} textAlign="center" fontWeight="$bold">
                    {animation.name}
                  </Text>
                  <Flex
                    width={8}
                    height={8}
                    borderRadius="$rounded4"
                    backgroundColor={animation.color}
                    style={{
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
          
          {/* Interactive animation selector with enhanced design */}
          <TouchableArea
            position="absolute"
            top="$spacing16"
            right="$spacing16"
            onPress={handleManualClick}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            zIndex={10}
          >
            <Flex
              backgroundColor={animation.color}
              borderRadius="$rounded16"
              paddingHorizontal="$spacing16"
              paddingVertical="$spacing8"
              alignItems="center"
              justifyContent="center"
              shadowColor="rgba(0, 0, 0, 0.2)"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.3)"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <Text variant="body4" color="white" fontWeight="$bold" fontSize={10}>
                {animation.name}
              </Text>
            </Flex>
          </TouchableArea>
          
          {/* Enhanced payment theme overlay */}
          <Flex
            position="absolute"
            bottom="$spacing16"
            left="$spacing16"
            right="$spacing16"
            backgroundColor="rgba(0, 0, 0, 0.8)"
            borderRadius="$rounded16"
            paddingHorizontal="$spacing16"
            paddingVertical="$spacing12"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.2)"
            zIndex={9}
            style={{
              backdropFilter: 'blur(10px)',
              transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
              opacity: isHovered ? 1 : 0.9,
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Text variant="body3" color="white" fontWeight="$bold" fontSize={12}>
              {animation.overlayText}
            </Text>
            <Text variant="body4" color="rgba(255, 255, 255, 0.8)" fontSize={10} mt="$spacing2">
              {animation.description}
            </Text>
          </Flex>
          
          {/* Enhanced indicator dots with animations */}
          <Flex
            position="absolute"
            top="$spacing16"
            left="$spacing16"
            flexDirection="row"
            gap="$spacing8"
            zIndex={8}
          >
            {animations.map((_, index) => (
              <TouchableArea
                key={index}
                onPress={() => {
                  setCurrentAnimation(index)
                  setClickCount(prev => prev + 1)
                  // Reset click count after 3 seconds
                  setTimeout(() => {
                    setClickCount(0)
                  }, 3000)
                }}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Flex
                  width={index === currentAnimation ? 12 : 8}
                  height={8}
                  borderRadius="$rounded4"
                  backgroundColor={index === currentAnimation ? animation.color : 'rgba(255, 255, 255, 0.5)'}
                  shadowColor="rgba(0, 0, 0, 0.2)"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.3}
                  shadowRadius={4}
                  style={{
                    transition: 'all 0.3s ease-in-out',
                    transform: index === currentAnimation ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              </TouchableArea>
            ))}
          </Flex>
          
          {/* Interactive status indicator */}
          <Flex
            position="absolute"
            bottom="$spacing8"
            right="$spacing8"
            opacity={0.7}
            zIndex={8}
          >
            <Flex flexDirection="row" alignItems="center" gap="$spacing4">
              <Flex
                width={6}
                height={6}
                borderRadius="$rounded4"
                backgroundColor={rive ? '#00FF88' : '#FFB800'}
                style={{
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <Text variant="body4" color="white" fontFamily="$code" fontSize={8}>
                {rive ? 'live' : 'loading'}
              </Text>
            </Flex>
          </Flex>
          
          {/* Click interaction counter */}
          {clickCount > 0 && clickCount < 10 && (
            <Flex
              position="absolute"
              top="$spacing24"
              right="$spacing24"
              style={{
                transform: 'translate(0, 0)',
                pointerEvents: 'none',
              }}
              zIndex={20}
            >
              <Text 
                fontSize={16} 
                color={animation.color}
                fontWeight="$bold"
                style={{
                  animation: 'bounce 0.5s ease-in-out',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                +{clickCount}
              </Text>
            </Flex>
          )}
        </Flex>
      </CardContents>
    </ValuePropCard>
  )
}
