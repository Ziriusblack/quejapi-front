import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Message {
  text: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule], 
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {

  userMessage: string = '';
  messages: Message[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userMessage.trim() || this.loading) return;

    const messageToSend = this.userMessage;

    this.messages.push({ text: messageToSend, from: 'user' });
    this.userMessage = '';
    this.loading = true;

this.http.post<any>(
  'http://localhost:8080/api/chat',
  {
    message: messageToSend
  },
  {
    withCredentials: true
  }
)
 
.subscribe({
  next: (res) => {
    console.log('Respuesta backend:', res); //ver qué devuelve

    this.messages.push({
      text: res.response, 
      from: 'bot'
    });

    this.loading = false;
  },
  error: (err) => {
    console.error('Error completo:', err); 

    this.messages.push({
      text: 'Error al conectar con el chatbot',
      from: 'bot'
    });

    this.loading = false;
  }

  
});

} 
confirmAction() {

  if (this.loading) return;

  this.userMessage = 'CONFIRMAR';

  this.sendMessage();
}
}