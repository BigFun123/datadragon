import React, { useRef, useEffect, useContext } from 'react';
import * as THREE from 'three';
import './graph.css';
import { BookContext } from '../../controllers/context';
import { FontLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';

const MaxCubes = 200000;

const Graph3D = () => {
    const mountRef = useRef(null);
    const context = useContext(BookContext);
    const cubeRef = useRef(null);
    const geometryRef = useRef(null);
    const materialRef = useRef(null);
    const sceneRef = useRef(null);
    const controlsRef = useRef(null);
    const [working, setWorking] = React.useState(false);

    useEffect(() => {
        const mount = mountRef.current;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.set(-20, 40, -20);



        // Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        controls.autoRotateTimeout = 10000;
        controls.target.set(10, 10, 10);
        controlsRef.current = controls;

        // look at the point 100, 100
        camera.lookAt(new THREE.Vector3(-10, 10, 10));


        // Geometry
        const geometry = new THREE.BoxGeometry();
        geometryRef.current = geometry;
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        materialRef.current = material;
        const cube = new THREE.InstancedMesh(geometryRef.current, materialRef.current, MaxCubes);
        cube.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(cube);
        cubeRef.current = cube;

        // Animation
        const animate = () => {
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 1000 / 30);
            controlsRef.current.update();

            renderer.render(scene, camera);
        };

        animate();

        createAxes();

        // Cleanup
        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        if (!cubeRef.current) return;
        if (!sceneRef.current) return;
        if (!context.sentiments.length) return;
        setWorking(true);
        console.log("sentiments changed");

        // delete existing cube
        sceneRef.current.remove(cubeRef.current);
        cubeRef.current.geometry.dispose();


        const cube = new THREE.InstancedMesh(geometryRef.current, materialRef.current, context.sentiments.length);
        cube.instanceMatrix.setUsage(THREE.DynamicDrawUsage);


        sceneRef.current.add(cube);
        cubeRef.current = cube;

        //const cube = cubeRef.current;
        const dummy = new THREE.Object3D();
        const xmax = Math.ceil(Math.sqrt(context.sentiments.length));
        const ymax = Math.ceil(Math.sqrt(context.sentiments.length));
        const spacing = 1.5;

        controlsRef.current.target.set(-xmax / 2, -20, ymax / 2);


        // move all the cubes out the way
        for (let i = 0; i < MaxCubes; i++) {
            dummy.position.set(-1000, -10000, 0);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            cube.setMatrixAt(i, dummy.matrix);
        }

        const colors = [];
        const numColors = 20;
        for (let i = numColors; i > numColors / 2; i--) {
            const color = new THREE.Color();
            color.setRGB(1 - (i - numColors / 2) / (numColors / 2), 1, 1 - (i - numColors / 2) / (numColors / 2)); // Fading from white to green
            colors.push(color.getHex());
        }
        for (let i = 0; i < numColors / 2; i++) {
            const color = new THREE.Color();
            color.setRGB(1, 1 - i / (numColors / 2), 1 - i / (numColors / 2)); // Fading from white to red
            colors.push(color.getHex());
        }

        for (let yi = 0; yi < ymax; yi++) {
            for (let xi = 0; xi < xmax; xi++) {
                const ap = xi + yi * xmax;
                const sentiment = context.sentiments[ap];
                if (!sentiment) continue;

                const color = new THREE.Color();

                let scalex = 1;
                let scaley = 1;
                let offset = 0;
                switch (context.sortOrder) {
                    case 'canonical':
                        color.setHex(colors[Math.floor(numColors - (numColors / 2 + sentiment.score * numColors / 2))]);
                        cube.setColorAt(ap, color);
                        //dummy.scale.set(1, 1.1 + sentiment.score * 25, 1);
                        scaley = 1.1 + sentiment.score * 25
                        offset = (scaley - 1) / 2;
                        // calculate the yoffset based on the scale
                        break;
                    case 'sentiment':
                        scaley = 1.1 + sentiment.score * 25;
                        color.setHex(colors[Math.floor(numColors - (numColors / 2 + sentiment.score * numColors / 2))]);
                        cube.setColorAt(ap, color);
                        offset = (scaley - 1) / 2;
                        break;
                    case 'frequency':
                        scaley = (context.maxFrequency > 0) ? sentiment.frequency / context.maxFrequency : 0.1;
                        //color.setHex(colors[Math.floor(numColors - (scaley) * numColors * 0.9)]);
                        color.setHex(colors[Math.floor(numColors - (numColors / 2 + sentiment.score * numColors / 2))]);
                        scaley *= 40;
                        offset = (scaley - 1) / 2;
                        cube.setColorAt(ap, color);
                        break;
                    case 'length':
                        scaley = (context.maxLength > 0) ? sentiment.length / context.maxLength : 1;
                        scaley = 1.1 + sentiment.length * 2;
                        color.setHex(colors[Math.floor(numColors - (sentiment.length * numColors / context.maxLength))]);
                        cube.setColorAt(ap, color);
                        offset = (scaley - 1) / 2;

                        break;
                    default:
                        dummy.scale.set(1, 1, 1);
                }


                dummy.position.set(-xi * spacing, offset, yi * spacing);
                dummy.rotation.set(0, 0, 0);
                dummy.scale.set(scalex, scaley, scalex);

                //dummy.scale.set(1, 1.1 + sentiment.score * 25, 1);
                dummy.updateMatrix();
                cube.setMatrixAt(ap, dummy.matrix);
            }
        }
        cube.instanceMatrix.needsUpdate = true;
        cube.computeBoundingSphere();
        setWorking(false);
    }, [context.sentiments]);

    function createAxes() {
        const axesHelper = new THREE.AxesHelper(25);
        sceneRef.current.add(axesHelper);
        //axesHelper.rotation.set(Math.PI, 0, 0);
        axesHelper.scale.set(-1, 1, 1);
        axesHelper.position.set(1, 0, -1);

    }

    function createText(x, y, z, text) {
        const loader = new FontLoader();
        loader.load('/fonts/helvetica.json', function (font) {
            const geometry = new TextGeometry(text.toString(), {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(x, y, z);
            textMesh.rotateX(-Math.PI / 2);
            sceneRef.current.add(textMesh);
        });
    }

    return <div>
        <div className='booktitle'>{context.bookTitle}</div>
        {working && <div className='label'>Loading: working.toString()</div>}
        <div ref={mountRef} style={{ width: '1024px', height: '642px' }} />
    </div>;
};

export default Graph3D;
