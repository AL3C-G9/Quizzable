import { Component, OnInit } from '@angular/core';
import { Scene,Engine, SceneLoader, ExecuteCodeAction, float, BoundingBox, BoundingBoxRenderer } from '@babylonjs/core';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { FreeCamera } from '@babylonjs/core/Cameras';
import { KeyboardEventTypes } from '@babylonjs/core/Events/keyboardEvents';
import { HemisphericLight } from '@babylonjs/core/Lights';
import { CubeTexture, PBRMaterial, StandardMaterial, Texture } from '@babylonjs/core/Materials';
import { Color3, Vector3 } from '@babylonjs/core/Maths';
import { AbstractMesh, Mesh, MeshBuilder } from '@babylonjs/core/Meshes';
import "@babylonjs/loaders/glTF";
import { DynamicTexture, Plane} from '@babylonjs/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

// ...



@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {

  scene!:Scene
  engine!:Engine
  animating_1 = true
  animating_2 = true
  octahedron1 !: Mesh;
  octahedron2 !: Mesh;
  octahedron3 !: Mesh;
  octahedron4 !: Mesh;
  octahedron5 !: Mesh;
  hero !: Mesh;
  target: any;
  box: any;
  names!: string[];
  pointsJ1 = localStorage.getItem("P1");
  pointsJ2 = localStorage.getItem("P2");
  //player1nom :string;
  //player2nom :string;
  player1nom= localStorage.getItem("nomJoueur1")
  player2nom= localStorage.getItem("nomJoueur2")
  
  constructor(private router:Router, private data: DataService, private route: ActivatedRoute) {  

  }

 async ngOnInit(): Promise<void> {
    const canva = document.querySelector('canvas')!
    this.engine = new Engine(canva, true)
    this.scene = await this.CreateScene()
    this.CreateGroud()
    this.CreatePlayStarter(this.scene, 1.0, 0.35, 0)
    this.CreatePlayStarter2(this.scene, 1.8, 0.35, 1)
    this.CreatePlayStarter3(this.scene, 2.6, 0.35, 0)
    this.CreatePlayStarter4(this.scene, 4.0, 0.35, 1)
    this.CreatePlayStarter5(this.scene, 4.5, 0.35, 0)
    //this.names = this.data.getNames();
    console.log(this.data.getNames())
    //this.player1nom=this.data.getName(0)
    //this.player2nom= this.data.getName(1)
   
    const j1 = document.getElementById("joueur1") as HTMLDivElement; 
    const j2 = document.getElementById("joueur2") as HTMLDivElement; 
    this.majPoints();
    j1.innerHTML = this.player1nom + ": " +localStorage.getItem("P1") +" points";
    j2.innerHTML = this.player2nom + ": " +localStorage.getItem("P2") + " points";

    const  hero   =  await this.CreateCommbatant(this.scene)
    hero.setPositionWithLocalVector(new Vector3(0.7,0,0));
    const  hero2  = await this.CreateCommbatant2(this.scene)
    const speed = 0.01

    const walk =   this.scene.getAnimationGroupByName("walk")
    const doubleAttack = this.scene.getAnimationGroupByName("doubleAttack")
    const attackSimple = this.scene.getAnimationGroupByName('Armature|mixamo.com|Layer0')
    const walking = this.scene.getAnimationGroupByName("walking")
    const block   =  this.scene.getAnimationGroupByName("block")

    const run  = this.scene.getAnimationGroupByName('run')
    const runback = this.scene.getAnimationGroupByName('runback')
    const id      =  this.scene.getAnimationGroupByName('id')
    const coupDePiedAllonger = this.scene.getAnimationGroupByName('coupDePiedAllonger')
    const coupDePied = this.scene.getAnimationGroupByName('coupDePied')
    const coupDePointPuissant = this.scene.getAnimationGroupByName('coupDePointPuissant')

    const inputMap:any = {}
    this.scene.actionManager = new ActionManager(this.scene)
    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger,function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type =="keydown"
    }))
    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger,function(evt){
      inputMap[evt.sourceEvent.key] =  evt.sourceEvent.type =="keydown"
    }))



   this.scene.onBeforeRenderObservable.add(() => {
      var keydown = false
      if(inputMap["s"]){
        hero.moveWithCollisions(hero.forward.scaleInPlace(speed))
        keydown = true
      }

      if(inputMap["x"]){
        hero.moveWithCollisions(hero.forward.scaleInPlace(-speed))
        keydown = true
      }

      if(inputMap["w"]){
        hero.rotate(Vector3.Up(),-0.1)
        keydown = true
      }

      if(inputMap["c"]){
        hero.rotate(Vector3.Up(),0.1)
        keydown = true
      }

      if(inputMap["d"]){
        doubleAttack?.start(false,1.0,doubleAttack?.from,doubleAttack.to,false)
      }



      // HERO 2

      if(inputMap["g"]){
        hero2.moveWithCollisions(hero2.forward.scaleInPlace(speed))
        keydown = true
      }
      if(inputMap["b"]){
        hero2.moveWithCollisions(hero2.forward.scaleInPlace(-speed))
        keydown = true
      }

      if(inputMap["v"]){
        hero2.rotate(Vector3.Up(),-0.1)
        keydown = true
      }

      if(inputMap["n"]){
        hero2.rotate(Vector3.Up(),0.1)
        keydown = true
      }

      if(inputMap["h"]){
        coupDePiedAllonger?.start(false,1.0,coupDePiedAllonger?.from,coupDePiedAllonger?.to,false)

      }

      if(inputMap["j"]){
        coupDePointPuissant?.start(false,1.0,coupDePointPuissant?.from,coupDePointPuissant?.to,false)
      }





      if(keydown){
        if(!this.animating_1){
            this.animating_1 = true
            if(inputMap["s"]){
              walking?.start(true,1.0,walking.from,walking.to,false)
            }

            if(inputMap["g"]){
              run?.start(true,1.0,run.from,run.to,false)
            }

            if(inputMap["b"]){
              runback?.start(true,1.0,runback.from,runback.to,false)
            }


        }
      }
      else{
        if(this.animating_1){
          coupDePiedAllonger?.stop()
          runback?.stop()
          run?.stop()
          walk?.stop()
          walking?.stop()
          doubleAttack?.stop()
          attackSimple?.stop()
          id?.start()
          block?.start()
          this.animating_1 = false

        }
      }

    })

    const b1 = this.CreateBox('Niveau 1').setPositionWithLocalVector(new Vector3(1,-0.01,0));
    const b2 = this.CreateBox('Niveau 2').setPositionWithLocalVector(new Vector3(1.8,0,1)); 
    const b3 = this.CreateBox('Niveau 3').setPositionWithLocalVector(new Vector3(2.6,-0.01,0));
    const b4 = this.CreateBox('Niveau 4').setPositionWithLocalVector(new Vector3(4.0,0,1)); 
    const b5 = this.CreateBox('Niveau 5').setPositionWithLocalVector(new Vector3(4.5,-0.01,0));
    console.log(this.data.getP1(), this.data.getP1())
    if(this.pointsJ1 && this.pointsJ2){
      if(parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==0){
        b1.setEnabled(true);
        b2.setEnabled(false);
        b3.setEnabled(false);
        b4.setEnabled(false);
        b5.setEnabled(false);
      }
      else if (parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==1){
        b1.setEnabled(false);
        b2.setEnabled(true);
        b3.setEnabled(false);
        b4.setEnabled(false);
        b5.setEnabled(false);
      }
      else if (parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==2){
        b1.setEnabled(false);
        b2.setEnabled(false);
        b3.setEnabled(true);
        b4.setEnabled(false);
        b5.setEnabled(false);
      }
      else if (parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==3){
        b1.setEnabled(false);
        b2.setEnabled(false);
        b3.setEnabled(false);
        b4.setEnabled(true);
        b5.setEnabled(false);
      }else if (parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==4){
        b1.setEnabled(false);
        b2.setEnabled(false);
        b3.setEnabled(false);
        b4.setEnabled(false);
        b5.setEnabled(true);
      }else if (parseInt(this.pointsJ1)+parseInt(this.pointsJ2)==5){
        b1.setEnabled(false);
        b2.setEnabled(false);
        b3.setEnabled(false);
        b4.setEnabled(false);
        b5.setEnabled(false);
        if(parseInt(this.pointsJ1)>parseInt(this.pointsJ2)){
          this.partieTermine('Fin de la partie ' +this.player1nom+ ' a gagne!');
        }
        else{
          this.partieTermine('Fin de la partie ' +this.player2nom+ ' a gagne!');
        }
      }
  }
   
;
};

majPoints(){
  if(this.data.getGagnantBox() == this.player1nom){
    if(this.pointsJ1){
      let point1 = parseInt(this.pointsJ1)+1;
      localStorage.setItem("P1", point1.toString())
    }
  }
  else if (this.data.getGagnantBox() == this.player2nom){
    if(this.pointsJ2){
      let point2 = parseInt(this.pointsJ2)+1;
      localStorage.setItem("P2", point2.toString())
    }
  }
  this.data.viderGagnantBox();
}

CreateBox(texte:any) : Mesh{
  const box = MeshBuilder.CreateBox('box', { size: 0.3 }, this.scene);
  
  const material = new StandardMaterial('material', this.scene);
  material.diffuseColor = new Color3(0.5, 0.5, 1);
  box.material = material;
  
  // Create a dynamic texture for the text box
  const dynamicTexture = new DynamicTexture('dynamicTexture', { width: 490, height: 240 }, this.scene);
  
  // Apply the dynamic texture to the plane
  material.diffuseTexture = dynamicTexture;
  
  // Create a text box
  const text = texte;
  const font = 'bold 60px Arial';
  const color = 'white';
  dynamicTexture.drawText(text, 20, 80, font, color, 'transparent', true);
  box.actionManager = new ActionManager(this.scene);
  //box.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger,this.ChangePageDialogBox));
  box.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger,
    (evt) => {
      this.router.navigate(['Model', 'Questions']);
    }));

  return box;
}

ChangePageDialogBox(){
  this.router.navigate(["Model", "Questions"]);
}

partieTermine(phrase : string) {
  const modal = document.getElementById("endPartie") as HTMLDivElement;
  const nextButton = document.querySelector('#acc') as HTMLButtonElement;
  const phrasePopup = document.getElementById("phraseFin") as HTMLDivElement;
  phrasePopup.innerHTML = phrase;
  modal.style.display = "block";
  nextButton.addEventListener('click', () => {
      //this.spin();
      this.router.navigate([""]);
      
   });
  
}

async CreateScene() : Promise<Scene>{
    this.engine.enableOfflineSupport = false
    const scene = new Scene(this.engine)
    const camera = new FreeCamera("camera", new Vector3(2.2,0.75,-3.2), this.scene)

    camera.attachControl()
    camera.speed = 0.25
    
    
    
    const envTex = CubeTexture.CreateFromPrefilteredData("../../assets/env/sky.env",scene)
    scene.environmentTexture = envTex
    scene.createDefaultSkybox(envTex, true)
    scene.environmentIntensity = 1
    return scene
  }

  CreatePlayStarter(scene : Scene, pos1: float, pos2: float, pos3:float) : Scene{
    //let octahedron: Mesh;
    
    this.octahedron1 = MeshBuilder.CreatePolyhedron(
      'octahedron',
      { type: 1, size: 0.14},
      this.scene
    );
    this.octahedron1.setPositionWithLocalVector(new Vector3(pos1, pos2, pos3));
    
    let material = new PBRMaterial("material", scene);
    //material.albedoColor = new Color3(0.5, 1, 0.5); // red color
    material.metallic = 0.8; // partially reflective
    material.roughness = 0.5; // partially shiny

    var redMat = new StandardMaterial("material", scene);
	  redMat.diffuseTexture = new Texture("assets/textures/painted_concrete_diff_4k.jpg", this.scene);
    this.octahedron1.material = redMat;

    let light = new HemisphericLight("light", new Vector3(0, 1, -1), this.scene);
	  light.specular = new Color3(0, 0.5, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render()
      this.octahedron1.rotation.y += 0.01;
    })


	
    return scene
  }

  CreatePlayStarter2(scene : Scene, pos1: float, pos2: float, pos3:float) : Scene{
    //let octahedron: Mesh;
    
    this.octahedron2 = MeshBuilder.CreatePolyhedron(
      'octahedron',
      { type: 1, size: 0.14},
      this.scene
    );
    this.octahedron2.setPositionWithLocalVector(new Vector3(pos1, pos2, pos3));
    
    let material = new PBRMaterial("material", scene);
    //material.albedoColor = new Color3(0.5, 1, 0.5); // red color
    material.metallic = 0.8; // partially reflective
    material.roughness = 0.5; // partially shiny

    var redMat = new StandardMaterial("material", scene);
	  redMat.diffuseTexture = new Texture("assets/textures/painted_concrete_diff_4k.jpg", this.scene);
    this.octahedron2.material = redMat;

    let light = new HemisphericLight("light", new Vector3(0, 1, -1), this.scene);
	  light.specular = new Color3(0, 0.5, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render()
      this.octahedron2.rotation.y += 0.01;
    })
	
    return scene
  }

  CreatePlayStarter3(scene : Scene, pos1: float, pos2: float, pos3:float) : Scene{
    //let octahedron: Mesh;
    
    this.octahedron3 = MeshBuilder.CreatePolyhedron(
      'octahedron',
      { type: 1, size: 0.14},
      this.scene
    );
    this.octahedron3.setPositionWithLocalVector(new Vector3(pos1, pos2, pos3));
    
    let material = new PBRMaterial("material", scene);
    //material.albedoColor = new Color3(0.5, 1, 0.5); // red color
    material.metallic = 0.8; // partially reflective
    material.roughness = 0.5; // partially shiny

    var redMat = new StandardMaterial("material", scene);
	  redMat.diffuseTexture = new Texture("assets/textures/painted_concrete_diff_4k.jpg", this.scene);
    this.octahedron3.material = redMat;

    let light = new HemisphericLight("light", new Vector3(0, 1, -1), this.scene);
	  light.specular = new Color3(0, 0.5, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render()
      this.octahedron3.rotation.y += 0.01;
    })


    return scene
  }

  CreatePlayStarter4(scene : Scene, pos1: float, pos2: float, pos3:float) : Scene{
    //let octahedron: Mesh;
    
    this.octahedron4 = MeshBuilder.CreatePolyhedron(
      'octahedron',
      { type: 1, size: 0.14},
      this.scene
    );
    this.octahedron4.setPositionWithLocalVector(new Vector3(pos1, pos2, pos3));
    
    let material = new PBRMaterial("material", scene);
    //material.albedoColor = new Color3(0.5, 1, 0.5); // red color
    material.metallic = 0.8; // partially reflective
    material.roughness = 0.5; // partially shiny

    var redMat = new StandardMaterial("material", scene);
	  redMat.diffuseTexture = new Texture("assets/textures/painted_concrete_diff_4k.jpg", this.scene);
    this.octahedron4.material = redMat;

    let light = new HemisphericLight("light", new Vector3(0, 1, -1), this.scene);
	  light.specular = new Color3(0, 0.5, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render()
      this.octahedron4.rotation.y += 0.01;
    })
	
    return scene
  }

  CreatePlayStarter5(scene : Scene, pos1: float, pos2: float, pos3:float) : Scene{
    //let octahedron: Mesh;
    
    this.octahedron5 = MeshBuilder.CreatePolyhedron(
      'octahedron',
      { type: 1, size: 0.14},
      this.scene
    );
    this.octahedron5.setPositionWithLocalVector(new Vector3(pos1, pos2, pos3));
    
    let material = new PBRMaterial("material", scene);
    //material.albedoColor = new Color3(0.5, 1, 0.5); // red color
    material.metallic = 0.8; // partially reflective
    material.roughness = 0.5; // partially shiny

    var redMat = new StandardMaterial("material", scene);
	  redMat.diffuseTexture = new Texture("assets/textures/painted_concrete_diff_4k.jpg", this.scene);
    this.octahedron5.material = redMat;

    let light = new HemisphericLight("light", new Vector3(0, 1, -1), this.scene);
	  light.specular = new Color3(0, 0.5, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render()
      this.octahedron5.rotation.y += 0.01;
    })
	
    return scene
  }

 CreateGroud(){


    const groud = MeshBuilder.CreateGround("groud",{width:100, height:10}, this.scene)
    groud.material  =this.CreateAsphalt()
  }


  CreateAsphalt() : PBRMaterial{
    const pbr = new PBRMaterial("pbr", this.scene)
    pbr.albedoTexture = new Texture("../../assets/textures/asphalt_diffuse.jpg",this.scene)
    pbr.bumpTexture = new Texture("../../assets/textures/asphalt_normal.jpg",this.scene)
    pbr.invertNormalMapX = true
    pbr.invertNormalMapY = true
    pbr.roughness = 1

    pbr.useAmbientOcclusionFromMetallicTextureRed = true
    pbr.useRoughnessFromMetallicTextureGreen =  true
    pbr.useMetallnessFromMetallicTextureBlue  = true

    pbr.metallicTexture = new Texture("../../assets/textures/asphalt_ao_rough_metal.jpg",this.scene)
    return pbr;
  }

 async CreateBarrel(){
  const {meshes} = await SceneLoader.ImportMeshAsync('','../../assets/models/','Barrel.glb')
  console.log("meshes",meshes)
}

intersectsBox(box1: BoundingBox, box2: BoundingBox): boolean {
  // Check for intersection along the x-axis
  if (box1.maximum.x < box2.minimum.x || box1.minimum.x > box2.maximum.x) {
    return false; // No intersection
  }

  // Check for intersection along the y-axis
  if (box1.maximum.y < box2.minimum.y || box1.minimum.y > box2.maximum.y) {
    return false; // No intersection
  }

  // Check for intersection along the z-axis
  if (box1.maximum.z < box2.minimum.z || box1.minimum.z > box2.maximum.z) {
    return false; // No intersection
  }

  // If there's no separation along any axis, the boxes intersect
  return true;
}

/*doMeshesCollide = (mesh1: Mesh, mesh2: Mesh): boolean => {
  //const boundingBox1 = this.octahedron1.getBoundingInfo().boundingBox;
  //const boundingBox2 = this.octahedron2.getBoundingInfo().boundingBox;
  //const boundingBox2 = mesh2.getBoundingInfo().boundingBox;
  this.octahedron1.computeWorldMatrix(true); // Met à jour la matrice du mesh
  this.octahedron2.computeWorldMatrix(true);
  const boundingBox1 = this.octahedron1.getBoundingInfo().boundingBox;
  const boundingBox2 = this.octahedron2.getBoundingInfo().boundingBox;
  if(boundingBox1.intersectsBox(boundingBox2))
boundingBox1.intersectsPoint
  return boundingBox1.intersectsBox(boundingBox2)
  //this.intersectsBox(boundingBox1, boundingBox2);
};*/

async CreateCommbatant(scene :Scene){
  const {meshes,animationGroups,skeletons} = await SceneLoader.ImportMeshAsync('','../../assets/models/','combattant5.glb',scene)
  console.log("meshes",meshes)
  console.log(animationGroups)
  console.log(skeletons)
  animationGroups[0].stop()
  const hero = meshes[0]
  hero.scaling.scaleInPlace(0.5)
  

  const skeleton = skeletons[0]
  const speed = 0.01

  return hero;
}

async CreateCommbatant2(scene :Scene){
  const {meshes,animationGroups,skeletons} = await SceneLoader.ImportMeshAsync('','../../assets/models/','guerrier.glb',scene)
  console.log("meshes",meshes)
  console.log(animationGroups)
  console.log(skeletons)
  animationGroups[0].stop()
  const hero2 = meshes[0]
  hero2.scaling.scaleInPlace(0.5)


  const skeleton = skeletons[0]
  const speed = 0.01

  const walk =   scene.getAnimationGroupByName("walk")
  const doubleAttack2 = scene.getAnimationGroupByName("doubleAttack")
  const attackSimple = scene.getAnimationGroupByName('Armature|mixamo.com|Layer0')
  const walking = scene.getAnimationGroupByName("walking")
  console.log(walking)
  return hero2;
}

}
