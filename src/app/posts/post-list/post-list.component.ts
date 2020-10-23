import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IPost } from '../interface/IPost';
import { PostsService } from '../service/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {
  //     title: "First post",
  //     content: "This is the first post's content"
  //   },
  //   {
  //     title: "Second post",
  //     content: "This is the second post's content"
  //   },{
  //     title: "Third post",
  //     content: "This is the third post's content"
  //   }]

  posts: IPost[] = [];
  isLoading: boolean = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();

    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: IPost[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
