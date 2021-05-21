export const state = () => ({
  drawer: {
    fixed: true,
    mini: false,
  },
  scrollbar_settings: {
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: false,
  },
  reactions: {
    like: {
      title: 'Like',
      value: 'like',
      color: '#2078f4',
    },
    love: {
      title: 'Love',
      value: 'love',
      color: '#f33e58',
    },
    haha: {
      title: 'Haha',
      value: 'haha',
      color: '#f7b125',
    },
    sad: {
      title: 'Sad',
      value: 'sad',
      color: '#f7b125',
    },
    wow: {
      title: 'Wow',
      value: 'wow',
      color: '#f7b125',
    },
    angry: {
      title: 'Angry',
      value: 'angry',
      color: '#e9710f',
    },
  },
})
