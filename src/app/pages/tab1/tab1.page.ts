import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public posts: Post[] = [];
  public habilitado = true;

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.siguientes();
    this.postsService.nuevoPost.subscribe(
      post => {
        this.posts.unshift(post);
      }
    );
  }

  recargar(event) {
    this.siguientes(event, true);
    this.habilitado = true;
    this.posts = [];
  }

  siguientes(event?, pull: boolean = false) {
    this.postsService.getPosts(pull).subscribe(
      response => {
        this.posts.push(...response.posts);

        if (event) {
          event.target.complete();

          if (response.posts.length === 0) {
            this.habilitado = false;
          }
        }
      }
    );
  }

}
