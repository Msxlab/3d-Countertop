// src/components/ThreeDPreview.js
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const ThreeDPreview = () => {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const { countertops } = useSelector(state => state.counterTop);
    
    useEffect(() => {
        if (!canvasRef.current) return;

        // Three.js kurulumu
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Kamera ayarları
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(5, 5, 5);

        // Renderer ayarları
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        rendererRef.current = renderer;
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.shadowMap.enabled = true;

        // Işıklandırma
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20);
        scene.add(gridHelper);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Tezgahları oluştur
        const createCountertop = (countertop) => {
            const geometry = new THREE.BoxGeometry(
                countertop.width / 10,
                countertop.depth / 10,
                countertop.height / 10
            );

            const material = new THREE.MeshPhongMaterial({
                color: countertop.color || 0xe0e0e0,
                specular: 0x111111,
                shininess: 30,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.position.set(
                countertop.x / 100,
                countertop.depth / 20,
                countertop.y / 100
            );
            mesh.rotation.y = THREE.MathUtils.degToRad(countertop.rotation || 0);

            return mesh;
        };

        // Tezgahları scene'e ekle
        countertops.forEach(countertop => {
            const mesh = createCountertop(countertop);
            scene.add(mesh);
        });

        // Pencere yeniden boyutlandırma
        const handleResize = () => {
            if (!canvasRef.current) return;
            
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animasyon döngüsü
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            scene.clear();
            controls.dispose();
        };
    }, [countertops]);

    return (
        <div className="relative h-96">
            <canvas
                ref={canvasRef}
                className="w-full h-full rounded-lg shadow-lg"
            />
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded shadow text-sm">
                <p>Fare ile döndürmek için tıklayıp sürükleyin</p>
                <p>Yakınlaştırmak için fare tekerleğini kullanın</p>
            </div>
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded shadow">
                <button
                    onClick={() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            const link = document.createElement('a');
                            link.download = 'tezgah-3d.png';
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 
                             transition-colors text-sm"
                >
                    Görüntüyü Kaydet
                </button>
            </div>
        </div>
    );
};