import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { IPost } from '../interface/IPost';

@Injectable({
  providedIn: 'root'
})

export class PostsService {

  private posts: IPost[] = [];
  private postsUpdated = new Subject<IPost[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts() {
    return this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostById(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: IPost = {
      id: null,
      title: title,
      content: content
    }

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: IPost = {
      id: id,
      title: title,
      content: content
    }

    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(item => item.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
