import React from 'react';

const colors = [
  '#fff',
  'rgba(54, 200, 227, 0.2)',
  'rgba(255, 129, 162, 0.2)',
  'rgba(112, 60, 129, 0.2)',
  'rgba(255, 154, 0, 0.2)',
  'rgba(198, 219, 69, 0.2)',
  'rgba(255, 222, 0, 0.2)',
  'rgba(233, 58, 39, 0.2)'
];

export const getEntityData = async entityId => {
  try {
    const res = await fetch(`https://cryptobots.me/api/bot/search`, {
      method: 'POST',
      body: JSON.stringify({ ids: [entityId] })
    });
    const { items: [bot] } = await res.json();
    return {
      id: bot.id,
      color: colors[bot.info.bg],
      image_url: `https://cryptobots.me/img/${bot.id}`,
      name: bot.id,
      url: `https://cryptobots.me/bot/${bot.id}`
    };
  } catch (e) {
    return undefined;
  }
};

export const entityTranslations = {
  commentPlaceholder: 'Beep your story',
  replyPlaceholder: 'Beep your reply',
  noEntitiesError: 'No bots found'
};

export const avatarSizes = {
  verySmall: { containerSize: '32px', imgSize: '40px', imgTopOffset: '75%', imgLeftOffset: '50%' },
  small: { containerSize: '44px', imgSize: '55px', imgTopOffset: '75%', imgLeftOffset: '50%' },
  medium: { containerSize: '54px', imgSize: '75px', imgTopOffset: '77%', imgLeftOffset: '50%' },
  large: { containerSize: '64px', imgSize: '90px', imgTopOffset: '75%', imgLeftOffset: '50%' }
};

export const EntityIcon = entityId => (
  <svg viewBox="0 0 50 50" width="50px" height="50px" style={{ height: '70%' }}>
    <path
      fillRule="evenodd"
      fill="rgb(255, 37, 206)"
      d="M1.097,22.334 L22.334,1.097 C23.800,-0.369 26.177,-0.369 27.643,1.097 L48.879,22.334 C50.345,23.800 50.345,26.177 48.879,27.643 L27.643,48.879 C26.177,50.345 23.800,50.345 22.334,48.879 L1.097,27.643 C-0.369,26.177 -0.369,23.800 1.097,22.334 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(255, 255, 255)"
      d="M2.000,45.000 L5.000,48.000 L10.000,43.000 L7.000,40.000 L2.000,45.000 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(255, 255, 255)"
      d="M48.000,45.000 L45.000,48.000 L40.000,43.000 L43.000,40.000 L48.000,45.000 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(255, 255, 255)"
      d="M48.000,5.000 L45.000,2.000 L40.000,7.000 L43.000,10.000 L48.000,5.000 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(255, 255, 255)"
      d="M2.000,5.000 L5.000,2.000 L10.000,7.000 L7.000,10.000 L2.000,5.000 Z"
    />
    <path
      fillRule="evenodd"
      opacity="0.302"
      fill="rgb(0, 0, 0)"
      d="M17.688,16.500 C19.714,18.062 22.245,19.000 25.000,19.000 C27.755,19.000 30.286,18.062 32.312,16.500 C35.158,18.694 37.000,22.128 37.000,26.000 C37.000,32.627 31.627,38.000 25.000,38.000 C18.373,38.000 13.000,32.627 13.000,26.000 C13.000,22.128 14.842,18.694 17.688,16.500 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(255, 255, 255)"
      d="M17.688,15.500 C19.714,17.061 22.245,18.000 25.000,18.000 C27.755,18.000 30.286,17.061 32.312,15.500 C35.158,17.694 37.000,21.128 37.000,25.000 C37.000,31.627 31.627,37.000 25.000,37.000 C18.373,37.000 13.000,31.627 13.000,25.000 C13.000,21.128 14.842,17.694 17.688,15.500 Z"
    />
    <path
      fillRule="evenodd"
      fill="rgb(64, 64, 64)"
      d="M25.000,22.500 C25.000,23.881 26.119,25.000 27.500,25.000 C28.504,25.000 29.364,24.405 29.761,23.551 C29.902,24.012 30.000,24.492 30.000,25.000 C30.000,27.761 27.761,30.000 25.000,30.000 C22.239,30.000 20.000,27.761 20.000,25.000 C20.000,22.239 22.239,20.000 25.000,20.000 C25.508,20.000 25.988,20.098 26.449,20.239 C25.595,20.636 25.000,21.496 25.000,22.500 Z"
    />
  </svg>
);
