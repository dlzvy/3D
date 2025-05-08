import React, { useRef, useEffect } from 'react';
import { useFBX, useAnimations } from '@react-three/drei';

function DanceModel({ isDancing }) {
  const modelRef = useRef();

  // Load model 
  const fbx = useFBX('/PAPA.fbx');
  const { actions } = useAnimations(fbx.animations, modelRef);

  useEffect(() => {
    // Stop all animations first
    Object.values(actions).forEach(action => action.stop());

    // Play animation if dancing
    if (isDancing && Object.keys(actions).length > 0) {
      const firstAction = Object.keys(actions)[0];
      actions[firstAction]?.reset().fadeIn(0.5).play();
    }
  }, [isDancing, actions]);

  return (
    <primitive 
      object={fbx} 
      ref={modelRef} 
      scale={0.02} 
      position={[0, -1, 0]} 
      rotation={[0, Math.PI, 0]} 
    />
  );
}

export default DanceModel;