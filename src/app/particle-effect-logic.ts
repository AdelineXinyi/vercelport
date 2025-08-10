// src/app/particle-effect-logic.ts

import * as THREE from 'three/webgpu';
import { atan, cos, float, max, min, mix, PI, PI2, sin, vec2, vec3, color, Fn, hash, hue, If, instanceIndex, Loop, mx_fractal_noise_float, mx_fractal_noise_vec3, pass, pcurve, storage, deltaTime, time, uv, uniform, step } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import WebGPU from 'three/addons/capabilities/WebGPU.js';

export const createParticleEffect = (mountRef: React.RefObject<HTMLDivElement>) => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGPURenderer;
    let postProcessing: any;
    let controls: OrbitControls;
    let timer: THREE.Timer;
    let light: THREE.PointLight;
    let gui: GUI | undefined;

    let updateParticles: any, spawnParticles: any;
    let getInstanceColor: any;

    const screenPointer = new THREE.Vector2();
    const scenePointer = new THREE.Vector3();
    const raycastPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );
    const raycaster = new THREE.Raycaster();

    const nbParticles = Math.pow( 2, 13 );

    const timeScale = uniform( 1.0 );
    const particleLifetime = uniform( 0.5 );
    const particleSize = uniform( 1.0 );
    const linksWidth = uniform( 0.005 );

    const colorOffset = uniform( 0.0 );
    const colorVariance = uniform( 2.0 );
    const colorRotationSpeed = uniform( 1.0 );

    const spawnIndex = uniform( 0 );
    const nbToSpawn = uniform( 5 );
    const spawnPosition = uniform( vec3( 0.0 ) );
    const previousSpawnPosition = uniform( vec3( 0.0 ) );

    const turbFrequency = uniform( 0.5 );
    const turbAmplitude = uniform( 0.5 );
    const turbOctaves = uniform( 2 );
    const turbLacunarity = uniform( 2.0 );
    const turbGain = uniform( 0.5 );
    const turbFriction = uniform( 0.01 );

    const init = () => {
        if (!mountRef.current) return;

        if (WebGPU.isAvailable() === false) {
            mountRef.current.appendChild(WebGPU.getErrorMessage());
            console.error('WebGPU is not available.');
            return;
        }

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 0, 10);

        scene = new THREE.Scene();

        timer = new THREE.Timer();
        // @ts-ignore
        timer.connect(document);

        renderer = new THREE.WebGPURenderer({ antialias: true });
        renderer.setClearColor(0x14171a);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        mountRef.current.appendChild(renderer.domElement);

        // @ts-ignore
        getInstanceColor = Fn(( [ i ] ) => {
            return hue( color( 0x0000ff ), colorOffset.add( mx_fractal_noise_float( i.toFloat().mul( .1 ), 2, 2.0, 0.5, colorVariance ) ) );
        });

        const particlePositions = storage( new THREE.StorageInstancedBufferAttribute( nbParticles, 4 ), 'vec4', nbParticles );
        const particleVelocities = storage( new THREE.StorageInstancedBufferAttribute( nbParticles, 4 ), 'vec4', nbParticles );

        // @ts-ignore
        renderer.computeAsync( Fn( () => {
            particlePositions.element( instanceIndex ).xyz.assign( vec3( 10000.0 ) );
            particlePositions.element( instanceIndex ).w.assign( vec3( - 1.0 ) );
        } )().compute( nbParticles ) );

        const particleQuadSize = 0.05;
        const particleGeom = new THREE.PlaneGeometry( particleQuadSize, particleQuadSize );
        const particleMaterial = new THREE.SpriteNodeMaterial();
        particleMaterial.blending = THREE.AdditiveBlending;
        particleMaterial.depthWrite = false;
        particleMaterial.positionNode = particlePositions.toAttribute();
        particleMaterial.scaleNode = vec2( particleSize );
        particleMaterial.rotationNode = atan( particleVelocities.toAttribute().y, particleVelocities.toAttribute().x );
        // @ts-ignore
        particleMaterial.colorNode = Fn( () => {
            const life = particlePositions.toAttribute().w;
            const modLife = pcurve( life.oneMinus(), 8.0, 1.0 );
            const pulse = pcurve( sin( hash( instanceIndex ).mul( PI2 ).add( time.mul( 0.5 ).mul( PI2 ) ) ).mul( 0.5 ).add( 0.5 ), 0.25, 0.25 ).mul( 10.0 ).add( 1.0 );
            return getInstanceColor( instanceIndex ).mul( pulse.mul( modLife ) );
        } )();

        // @ts-ignore
        particleMaterial.opacityNode = Fn( () => {
            const circle = step( uv().xy.sub( 0.5 ).length(), 0.5 );
            const life = particlePositions.toAttribute().w;
            return circle.mul( life );
        } )();

        const particleMesh = new THREE.InstancedMesh( particleGeom, particleMaterial, nbParticles );
        particleMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
        particleMesh.frustumCulled = false;
        scene.add( particleMesh );

        const linksIndices = [];
        for ( let i = 0; i < nbParticles; i ++ ) {
            const baseIndex = i * 8;
            for ( let j = 0; j < 2; j ++ ) {
                const offset = baseIndex + j * 4;
                linksIndices.push( offset, offset + 1, offset + 2, offset, offset + 2, offset + 3 );
            }
        }
        const nbVertices = nbParticles * 8;
        const linksVerticesSBA = new THREE.StorageBufferAttribute( nbVertices, 4 );
        const linksColorsSBA = new THREE.StorageBufferAttribute( nbVertices, 4 );
        const linksGeom = new THREE.BufferGeometry();
        linksGeom.setAttribute( 'position', linksVerticesSBA );
        linksGeom.setAttribute( 'color', linksColorsSBA );
        linksGeom.setIndex( linksIndices );
        const linksMaterial = new THREE.MeshBasicNodeMaterial();
        linksMaterial.vertexColors = true;
        linksMaterial.side = THREE.DoubleSide;
        linksMaterial.transparent = true;
        linksMaterial.depthWrite = false;
        linksMaterial.depthTest = false;
        linksMaterial.blending = THREE.AdditiveBlending;
        linksMaterial.opacityNode = storage( linksColorsSBA, 'vec4', linksColorsSBA.count ).toAttribute().w;
        const linksMesh = new THREE.Mesh( linksGeom, linksMaterial );
        linksMesh.frustumCulled = false;
        scene.add( linksMesh );

        // @ts-ignore
        updateParticles = Fn( () => {
            const position = particlePositions.element( instanceIndex ).xyz;
            const life = particlePositions.element( instanceIndex ).w;
            const velocity = particleVelocities.element( instanceIndex ).xyz;
            const dt = deltaTime.mul( 0.1 ).mul( timeScale );

            If( life.greaterThan( 0.0 ), () => {
                const localVel = mx_fractal_noise_vec3( position.mul( turbFrequency ), turbOctaves, turbLacunarity, turbGain, turbAmplitude ).mul( life.add( .01 ) );
                velocity.addAssign( localVel );
                velocity.mulAssign( turbFriction.oneMinus() );
                position.addAssign( velocity.mul( dt ) );
                life.subAssign( dt.mul( particleLifetime.reciprocal() ) );

                const closestDist1 = float( 10000.0 ).toVar();
                const closestPos1 = vec3( 0.0 ).toVar();
                const closestLife1 = float( 0.0 ).toVar();
                const closestDist2 = float( 10000.0 ).toVar();
                const closestPos2 = vec3( 0.0 ).toVar();
                const closestLife2 = float( 0.0 ).toVar();

                Loop( nbParticles, ({ i }: { i: any }) => {
                    const otherPart = particlePositions.element(i);
                    If(i.notEqual(instanceIndex).and(otherPart.w.greaterThan(0.0)), () => {
                        const otherPosition = otherPart.xyz;
                        const dist = position.sub(otherPosition).lengthSq();
                        const moreThanZero = dist.greaterThan(0.0);
                        If(dist.lessThan(closestDist1).and(moreThanZero), () => {
                            closestDist1.assign(dist);
                            closestPos1.assign(otherPosition.xyz);
                            closestLife1.assign(otherPart.w);
                        }).ElseIf(dist.lessThan(closestDist2).and(moreThanZero), () => {
                            closestDist2.assign(dist);
                            closestPos2.assign(otherPosition.xyz);
                            closestLife2.assign(otherPart.w);
                        });
                    });
                });

                const linksPositions = storage(linksVerticesSBA, 'vec4', linksVerticesSBA.count);
                const linksColors = storage(linksColorsSBA, 'vec4', linksColorsSBA.count);
                const firstLinkIndex = instanceIndex.mul(8);
                const secondLinkIndex = firstLinkIndex.add(4);

                linksPositions.element(firstLinkIndex).xyz.assign(position);
                linksPositions.element(firstLinkIndex).y.addAssign(linksWidth);
                linksPositions.element(firstLinkIndex.add(1)).xyz.assign(position);
                linksPositions.element(firstLinkIndex.add(1)).y.addAssign(linksWidth.negate());
                linksPositions.element(firstLinkIndex.add(2)).xyz.assign(closestPos1);
                linksPositions.element(firstLinkIndex.add(2)).y.addAssign(linksWidth.negate());
                linksPositions.element(firstLinkIndex.add(3)).xyz.assign(closestPos1);
                linksPositions.element(firstLinkIndex.add(3)).y.addAssign(linksWidth);
                linksPositions.element(secondLinkIndex).xyz.assign(position);
                linksPositions.element(secondLinkIndex).y.addAssign(linksWidth);
                linksPositions.element(secondLinkIndex.add(1)).xyz.assign(position);
                linksPositions.element(secondLinkIndex.add(1)).y.addAssign(linksWidth.negate());
                linksPositions.element(secondLinkIndex.add(2)).xyz.assign(closestPos2);
                linksPositions.element(secondLinkIndex.add(2)).y.addAssign(linksWidth.negate());
                linksPositions.element(secondLinkIndex.add(3)).xyz.assign(closestPos2);
                linksPositions.element(secondLinkIndex.add(3)).y.addAssign(linksWidth);

                const linkColor = getInstanceColor(instanceIndex);
                const l1 = max(0.0, min(closestLife1, life)).pow(0.8);
                const l2 = max(0.0, min(closestLife2, life)).pow(0.8);

                Loop(4, ({ i }: { i: any }) => {
                    linksColors.element(firstLinkIndex.add(i)).xyz.assign(linkColor);
                    linksColors.element(firstLinkIndex.add(i)).w.assign(l1);
                    linksColors.element(secondLinkIndex.add(i)).xyz.assign(linkColor);
                    linksColors.element(secondLinkIndex.add(i)).w.assign(l2);
                });
            });
        } )().compute( nbParticles );

        // @ts-ignore
        spawnParticles = Fn( () => {
            const particleIndex = spawnIndex.add( instanceIndex ).mod( nbParticles ).toInt();
            const position = particlePositions.element( particleIndex ).xyz;
            const life = particlePositions.element( particleIndex ).w;
            const velocity = particleVelocities.element( particleIndex ).xyz;
            life.assign( 1.0 );
            const rRange = float( 0.01 );
            const rTheta = hash( particleIndex ).mul( PI2 );
            const rPhi = hash( particleIndex.add( 1 ) ).mul( PI );
            const rx = sin( rTheta ).mul( cos( rPhi ) );
            const ry = sin( rTheta ).mul( sin( rPhi ) );
            const rz = cos( rTheta );
            const rDir = vec3( rx, ry, rz );
            const pos = mix( previousSpawnPosition, spawnPosition, instanceIndex.toFloat().div( nbToSpawn.sub( 1 ).toFloat() ).clamp() );
            position.assign( pos.add( rDir.mul( rRange ) ) );
            velocity.assign( rDir.mul( 5.0 ) );
        } )().compute( nbToSpawn.value );

        const backgroundGeom = new THREE.IcosahedronGeometry( 100, 5 ).applyMatrix4( new THREE.Matrix4().makeScale( - 1, 1, 1 ) );
        const backgroundMaterial = new THREE.MeshStandardNodeMaterial();
        backgroundMaterial.roughness = 0.4;
        backgroundMaterial.metalness = 0.9;
        backgroundMaterial.flatShading = true;
        backgroundMaterial.colorNode = color( 0x0 );
        const backgroundMesh = new THREE.Mesh( backgroundGeom, backgroundMaterial );
        scene.add( backgroundMesh );
        light = new THREE.PointLight( 0xffffff, 3000 );
        scene.add( light );
        postProcessing = new THREE.PostProcessing( renderer );
        const scenePass = pass( scene, camera );
        const scenePassColor = scenePass.getTextureNode('output');
        const bloomPass = bloom( scenePassColor, 0.75, 0.1, 0.5 );
        postProcessing.outputNode = scenePassColor.add( bloomPass );
        controls = new OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.maxDistance = 75;

        if (process.env.NODE_ENV === 'development') {
            gui = new GUI();
            gui.title('Controls');

            const particlesFolder = gui.addFolder('Particles');
            particlesFolder.add(timeScale, 'value', 0, 5).name('Time Scale');
            particlesFolder.add(particleLifetime, 'value', 0, 2).name('Lifetime');
            particlesFolder.add(particleSize, 'value', 0, 2).name('Size');

            const linksFolder = gui.addFolder('Links');
            linksFolder.add(linksWidth, 'value', 0, 0.02).name('Links Width');
            
            const colorFolder = gui.addFolder('Color');
            colorFolder.add(colorVariance, 'value', 0, 5).name('Variance');
            colorFolder.add(colorRotationSpeed, 'value', 0, 5).name('Rotation Speed');
            colorFolder.add(colorOffset, 'value', 0, 5).name('Offset');

            const turbulenceFolder = gui.addFolder('Turbulence');
            turbulenceFolder.add(turbFrequency, 'value', 0, 1).name('Frequency');
            turbulenceFolder.add(turbAmplitude, 'value', 0, 1).name('Amplitude');
            turbulenceFolder.add(turbOctaves, 'value', 0, 5, 1).name('Octaves');
            turbulenceFolder.add(turbLacunarity, 'value', 0, 5).name('Lacunarity');
            turbulenceFolder.add(turbGain, 'value', 0, 1).name('Gain');
            turbulenceFolder.add(turbFriction, 'value', 0, 0.1).name('Friction');
        }
    };

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onPointerMove = (e: PointerEvent) => {
        screenPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        screenPointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
    };

    const updatePointer = () => {
        raycaster.setFromCamera(screenPointer, camera);
        raycaster.ray.intersectPlane(raycastPlane, scenePointer);
    };

    const animate = () => {
        timer.update();
        renderer.compute(updateParticles);
        renderer.compute(spawnParticles);
        spawnIndex.value = (spawnIndex.value + nbToSpawn.value) % nbParticles;
        raycastPlane.normal.applyEuler(camera.rotation);
        updatePointer();
        previousSpawnPosition.value.copy(spawnPosition.value);
        spawnPosition.value.lerp(scenePointer, 0.1);
        colorOffset.value += timer.getDelta() * colorRotationSpeed.value * timeScale.value;
        const elapsedTime = timer.getElapsed();
        light.position.set(
            Math.sin(elapsedTime * 0.5) * 30,
            Math.cos(elapsedTime * 0.3) * 30,
            Math.sin(elapsedTime * 0.2) * 30,
        );
        controls.update();
        postProcessing.render();
    };

    const cleanup = () => {
        if (mountRef.current && renderer) {
            mountRef.current.removeChild(renderer.domElement);
        }
        if (gui) {
            gui.destroy();
        }
        if (timer) {
            timer.dispose();
        }
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('pointermove', onPointerMove);
    };

    return { init, animate, cleanup, onWindowResize, onPointerMove };
};