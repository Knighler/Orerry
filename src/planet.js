import * as THREE from "../node_modules/three";

export default class Planet extends THREE.Group {
    constructor(x, y, scene, geometry, axisSpeed, sunSpeed = 0) {
        super();
        this.rotation.x = x * Math.PI / 180;
        this.rotation.y = y * Math.PI / 180;
        this.geometry = geometry
        this.axisSpeed = axisSpeed
        this.sunSpeed = sunSpeed
        scene.add(this);
        this.shape = null
        this.nightShape = null
        this.clouds = null
        this.light = null
        this.rings = null
        this.fresnel = null
    }

    addMesh(material, type = "basic", scale = false, scalar = 1.005) {
        const Geometry = new THREE.IcosahedronGeometry(this.geometry[0], this.geometry[1]);
        var Material = "";

        switch (type) {
            case "basic":
                Material = new THREE.MeshBasicMaterial(material);
                break;
            case "phong":
                Material = new THREE.MeshPhongMaterial(material);
                break;
            case "fresnel":
                Material = Planet.getFresnel(material);
                scale = true
                break;
            case "standard":
                Material = new THREE.MeshStandardMaterial(material);
                scale = true
                break;
            default:
                break;
        }

        const Mesh = new THREE.Mesh(Geometry, Material);
        if (scale) {
            Mesh.scale.setScalar(scalar);
        }
        this.add(Mesh);
        return Mesh
    }

    addRing(geometry, material, scale, rotation = { x: null, y: null }) {
        const Geometry = new THREE.RingGeometry(geometry[0], geometry[1], geometry[2]);
        const Material = new THREE.MeshBasicMaterial(material);
        const Mesh = new THREE.Mesh(Geometry, Material);

        if (rotation.x) {
            Mesh.rotation.x = rotation.x
        }
        if (rotation.y) {
            Mesh.rotation.x = rotation.x
        }

        this.add(Mesh);
        this.scale.set(scale[0], scale[1], scale[2]);
        this.rings = Mesh
        return Mesh
    }

    addLight(details) {
        const light = new THREE.PointLight(details[0], details[1], details[2], details[3], details[4], details[5]);
        this.add(light);
        this.light = light
        return light
    }

    createShape(material, nightMaterial, fresnel, clouds = {}, ring = {}) {
        this.shape = this.addMesh(material, "phong")
        this.nightShape = this.addMesh(nightMaterial)
        this.fresnel = this.addMesh(fresnel.rimHex, "fresnel", true, fresnel.scalar)

        if (Object.keys(clouds).length != 0) {
            this.clouds = this.addMesh(clouds.material, "standard", true, clouds.scalar)
        }

        if (Object.keys(ring).length != 0) {
            this.rings = this.addRing(ring.geometry, ring.material, ring.scale, ring.rotation)
        }
    }

    rotateAroundAxis(speedFactor, direction="+") {
        switch (direction) {
            case "+":
                if (this.rings) {
                    this.shape.rotation.y += this.axisSpeed * speedFactor;
                    this.nightShape.rotation.y += this.axisSpeed * speedFactor;
                    this.fresnel.rotation.y += this.axisSpeed * speedFactor;
                    if (this.clouds) {
                        this.clouds.rotation.y += this.axisSpeed * speedFactor;
                    }
                } else {
                    this.rotation.y += this.axisSpeed * speedFactor;
                }
                break;

            case "-":
                if (this.rings) {
                    this.shape.rotation.y -= this.axisSpeed * speedFactor;
                    this.nightShape.rotation.y -= this.axisSpeed * speedFactor;
                    this.fresnel.rotation.y -= this.axisSpeed * speedFactor;
                    if (this.clouds) {
                        this.clouds.rotation.y -= this.axisSpeed * speedFactor;
                    }
                } else {
                    this.rotation.y -= this.axisSpeed * speedFactor;
                }
                break;

            default:
                break;
        }

    }

    static getFresnel(rimHex) {
        const facingHex = 0x000000
        const uniforms = {
            color1: { value: new THREE.Color(rimHex) },
            color2: { value: new THREE.Color(facingHex) },
            fresnelBias: { value: 0.1 },
            fresnelScale: { value: 1.0 },
            fresnelPower: { value: 4.0 },
        };
        const vs = `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
        
        varying float vReflectionFactor;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        
          vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        
          vec3 I = worldPosition.xyz - cameraPosition;
        
          vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
        
          gl_Position = projectionMatrix * mvPosition;
        }
        `;
        const fs = `
        uniform vec3 color1;
        uniform vec3 color2;
        
        varying float vReflectionFactor;
        
        void main() {
          float f = clamp( vReflectionFactor, 0.0, 1.0 );
          gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
        }
        `;
        const fresnelMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs,
            transparent: true,
            blending: THREE.AdditiveBlending,
            // wireframe: true,
        });
        return fresnelMat;
    }
}
