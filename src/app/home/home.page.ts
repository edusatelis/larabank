import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

tasks: Array<any> = [];
constructor(
  private alertCtrl: AlertController,
  private toastCtrl: ToastController,
  private actionSheetCtrl: ActionSheetController)
{
  let tasksJson = localStorage.getItem('tasksDb');
  if(tasksJson != null){
    this.tasks = JSON.parse(tasksJson);
  }
}

async showAdd(){
 const alert = await this.alertCtrl.create({
   header: 'O que deseja fazer?',
   inputs: [
     {
       name: 'taskToDo',
       type: 'text',
       placeholder: 'Ex: Comprar pão'
     }
   ],
   buttons: [
     {
       text: 'Cancelar',
       role: 'cancel',
       cssClass: 'secondary',
       handler: () => {
         console.log('Confirm Cancel')
       }
     },{
       text: 'Adicionar',
       handler: (form) => {
         this.add(form.taskToDo);
       }
     }
   ]
 });

 await alert.present();
}

async add(taskToDo: string){
  if(taskToDo.trim().length < 1){
    const toast = await this.toastCtrl.create({
      message: 'Informe o que deseja fazer!',
      duration: 2000,
      position: 'top'
    });
    
    return await toast.present();
  }

  let task = {name: taskToDo, done: false};
  this.tasks.push(task);
}

async openActions(task: any){
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'O que deseja Fazer?',
    buttons: [{
      text: task.done ? 'Desmarcar': 'Marcar',
      icon: task.done ? 'radio-button-off' : 'checkmark-circle',
      handler: () =>{
        task.done = !task.done;
        this.updateLocalStorage();
      }
    },{
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: ()=>{
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();
}

updateLocalStorage(){
  localStorage.setItem('tasksDb', JSON.stringify(this.tasks));
}

delete(task:any){
  this.tasks = this.tasks.filter(taskArray => task != taskArray);
  this.updateLocalStorage();
}

}
