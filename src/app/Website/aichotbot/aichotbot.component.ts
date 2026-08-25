import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatApiResponse, ChatService } from 'src/app/service/chat.service';

interface ChatMessage {
  id: number;
  sender: 'assistant' | 'user';
  text?: string;
  html?: string;
  time: string;
  isError?: boolean;
}

interface ChatShortcut {
  icon: string;
  label: string;
  prompt: string;
}

@Component({
  selector: 'app-aichotbot',
  templateUrl: './aichotbot.component.html',
  styleUrls: ['./aichotbot.component.css'],
})
export class AichotbotComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('messagesPane')
  private messagesPane?: ElementRef<HTMLDivElement>;

  promptControl = new FormControl('');
  messages: ChatMessage[] = [];
  isTyping = false;
  readonly modeLabel = 'Instant';
  readonly shortcuts: ChatShortcut[] = [
    {
      icon: 'far fa-image',
      label: 'Create an image',
      prompt: 'Create a dreamy hero image idea for a luxury beach getaway.',
    },
    {
      icon: 'fas fa-pen-nib',
      label: 'Write or edit',
      prompt: 'Write a short luxury tour description for Bali.',
    },
    {
      icon: 'fas fa-globe',
      label: 'Look something up',
      prompt: 'Look up the best season to visit Switzerland.',
    },
  ];

  private nextId = 1;
  private shouldScrollToBottom = true;
  private requestSubscription?: Subscription;

  constructor(private chatService: ChatService) {}

  get canSend(): boolean {
    return !this.isTyping && !!this.promptControl.value?.trim();
  }

  get hasConversation(): boolean {
    return this.messages.length > 0 || this.isTyping;
  }

  ngAfterViewChecked(): void {
    if (!this.shouldScrollToBottom || !this.messagesPane) {
      return;
    }

    const container = this.messagesPane.nativeElement;
    container.scrollTop = container.scrollHeight;
    this.shouldScrollToBottom = false;
  }

  useShortcut(prompt: string): void {
    if (this.isTyping) {
      return;
    }

    this.sendMessage(prompt);
  }

  onComposerSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.sendMessage();
  }

  sendMessage(prefilledPrompt?: string): void {
    if (this.isTyping) {
      return;
    }

    const message = (prefilledPrompt ?? this.promptControl.value ?? '').trim();
    if (!message) {
      return;
    }

    const history = this.previousUserMessages();
    this.messages = [...this.messages, this.createMessage('user', { text: message })];
    this.promptControl.setValue('');
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    this.requestSubscription?.unsubscribe();
    this.requestSubscription = this.chatService.sendMessage(message, history).subscribe({
      next: (response) => {
        const html = this.extractResponseHtml(response);
        const fallbackText =
          'I received a response, but there was no formatted travel result to show.';

        this.messages = [
          ...this.messages,
          this.createMessage('assistant', html ? { html } : { text: fallbackText }),
        ];
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        const errorMessage =
          error?.message === 'AUTH_TOKEN_MISSING'
            ? 'Please login first so I can send your message with the required bearer token.'
            : 'I could not reach the travel assistant right now. Please try again in a moment.';

        this.messages = [
          ...this.messages,
          this.createMessage('assistant', {
            text: errorMessage,
            isError: true,
          }),
        ];
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      },
    });
  }

  cancelRequest(): void {
    if (!this.isTyping) {
      return;
    }

    this.requestSubscription?.unsubscribe();
    this.isTyping = false;
  }

  copyMessage(message: ChatMessage): void {
    const plainText = this.htmlToText(message.html) || message.text || '';
    if (!plainText) {
      return;
    }

    navigator.clipboard?.writeText(plainText);
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }

  private createMessage(
    sender: 'assistant' | 'user',
    content: { text?: string; html?: string; isError?: boolean }
  ): ChatMessage {
    return {
      id: this.nextId++,
      sender,
      text: content.text,
      html: content.html,
      time: this.formatTime(),
      isError: content.isError,
    };
  }

  private extractResponseHtml(response: ChatApiResponse): string | undefined {
    const rawHtml = response.html?.full;
    if (!rawHtml) {
      return undefined;
    }

    return this.normalizeResponseHtml(rawHtml);
  }

  private normalizeResponseHtml(html: string): string {
    const parser = new DOMParser();
    const documentFragment = parser.parseFromString(html, 'text/html');

    documentFragment.querySelectorAll('script, style, iframe, object, embed, link').forEach((node) => {
      node.remove();
    });

    documentFragment.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        const attrName = attribute.name.toLowerCase();
        if (attrName === 'style' || attrName.startsWith('on')) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    return documentFragment.body.innerHTML;
  }

  private htmlToText(html?: string): string {
    if (!html) {
      return '';
    }

    const parser = new DOMParser();
    const documentFragment = parser.parseFromString(html, 'text/html');
    return documentFragment.body.textContent?.trim() || '';
  }

  private previousUserMessages(): string[] {
    return this.messages
      .filter((entry) => entry.sender === 'user' && !!entry.text?.trim())
      .slice(-8)
      .map((entry) => entry.text!.trim());
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
