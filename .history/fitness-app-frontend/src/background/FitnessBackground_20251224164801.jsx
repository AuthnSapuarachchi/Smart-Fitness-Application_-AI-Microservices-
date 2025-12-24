

const FitnessBackground = () => {
    const fitnessIcons = [
      { Icon: FitnessCenterIcon, top: '10%', left: '10%', size: 60, delay: 0 },
      { Icon: DirectionsRunIcon, top: '20%', right: '15%', size: 50, delay: 0.5 },
      { Icon: DirectionsBikeIcon, top: '70%', left: '8%', size: 55, delay: 1 },
      { Icon: PoolIcon, top: '60%', right: '10%', size: 45, delay: 1.5 },
      { Icon: SportsGymnasticsIcon, top: '40%', left: '5%', size: 50, delay: 2 },
      { Icon: FavoriteBorderIcon, top: '15%', left: '85%', size: 40, delay: 2.5 },
      { Icon: LocalFireDepartmentIcon, top: '80%', left: '75%', size: 48, delay: 3 },
      { Icon: SelfImprovementIcon, top: '35%', right: '5%', size: 42, delay: 3.5 },
      { Icon: DirectionsRunIcon, top: '85%', left: '20%', size: 38, delay: 4 },
      { Icon: DirectionsBikeIcon, top: '50%', right: '20%', size: 52, delay: 4.5 },
    ]

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }
        }}
      >
        {fitnessIcons.map((item, index) => {
          const { Icon, top, left, right, size, delay } = item
          return (
            <Box
              key={index}
              className="fitness-icon"
              sx={{
                position: 'absolute',
                top,
                left,
                right,
                animation: `float 6s ease-in-out ${delay}s infinite`,
                opacity: 0.15,
              }}
            >
              <Icon sx={{ fontSize: size, color: 'white' }} />
            </Box>
          )
        })}
      </Box>
    )
  }