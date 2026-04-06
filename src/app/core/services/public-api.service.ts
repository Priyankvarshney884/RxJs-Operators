import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  private http = inject(HttpClient);

  // JSONPlaceholder API endpoints
  private readonly JSON_PLACEHOLDER_BASE = 'https://jsonplaceholder.typicode.com';
  
  // GitHub API endpoints
  private readonly GITHUB_API_BASE = 'https://api.github.com';
  
  // REST Countries API
  private readonly COUNTRIES_API_BASE = 'https://restcountries.com/v3.1';

  constructor() {}

  // ==================== JSONPlaceholder APIs ====================

  /**
   * Get all users from JSONPlaceholder
   */
  getJSONPlaceholderUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/users`);
  }

  /**
   * Get a single user by ID from JSONPlaceholder
   */
  getJSONPlaceholderUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.JSON_PLACEHOLDER_BASE}/users/${id}`);
  }

  /**
   * Get all posts from JSONPlaceholder
   */
  getJSONPlaceholderPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/posts`);
  }

  /**
   * Get posts by user ID from JSONPlaceholder
   */
  getJSONPlaceholderPostsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/posts?userId=${userId}`);
  }

  /**
   * Get a single post by ID from JSONPlaceholder
   */
  getJSONPlaceholderPost(id: number): Observable<any> {
    return this.http.get<any>(`${this.JSON_PLACEHOLDER_BASE}/posts/${id}`);
  }

  /**
   * Get comments for a post from JSONPlaceholder
   */
  getJSONPlaceholderComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/posts/${postId}/comments`);
  }

  /**
   * Get all comments from JSONPlaceholder
   */
  getAllJSONPlaceholderComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/comments`);
  }

  /**
   * Get all albums from JSONPlaceholder
   */
  getJSONPlaceholderAlbums(): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/albums`);
  }

  /**
   * Get photos from an album from JSONPlaceholder
   */
  getJSONPlaceholderPhotos(albumId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/albums/${albumId}/photos`);
  }

  /**
   * Get all todos from JSONPlaceholder
   */
  getJSONPlaceholderTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/todos`);
  }

  /**
   * Get todos by user ID from JSONPlaceholder
   */
  getJSONPlaceholderTodosByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.JSON_PLACEHOLDER_BASE}/todos?userId=${userId}`);
  }

  // ==================== GitHub APIs ====================

  /**
   * Search GitHub repositories
   */
  searchGitHubRepos(query: string, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.GITHUB_API_BASE}/search/repositories?q=${query}&per_page=${perPage}`);
  }

  /**
   * Get a GitHub user by username
   */
  getGitHubUser(username: string): Observable<any> {
    return this.http.get<any>(`${this.GITHUB_API_BASE}/users/${username}`);
  }

  /**
   * Get repositories for a GitHub user
   */
  getGitHubUserRepos(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.GITHUB_API_BASE}/users/${username}/repos`);
  }

  /**
   * Get a specific GitHub repository
   */
  getGitHubRepo(owner: string, repo: string): Observable<any> {
    return this.http.get<any>(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  /**
   * Get contributors for a GitHub repository
   */
  getGitHubRepoContributors(owner: string, repo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contributors`);
  }

  /**
   * Get issues for a GitHub repository
   */
  getGitHubRepoIssues(owner: string, repo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/issues`);
  }

  /**
   * Search GitHub users
   */
  searchGitHubUsers(query: string, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.GITHUB_API_BASE}/search/users?q=${query}&per_page=${perPage}`);
  }

  // ==================== REST Countries APIs ====================

  /**
   * Get all countries
   */
  getAllCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/all`);
  }

  /**
   * Get a country by name
   */
  getCountryByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/name/${name}`);
  }

  /**
   * Get a country by full name
   */
  getCountryByFullName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/name/${name}?fullText=true`);
  }

  /**
   * Get a country by code (alpha2 or alpha3)
   */
  getCountryByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.COUNTRIES_API_BASE}/alpha/${code}`);
  }

  /**
   * Get countries by currency
   */
  getCountriesByCurrency(currency: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/currency/${currency}`);
  }

  /**
   * Get countries by language
   */
  getCountriesByLanguage(language: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/lang/${language}`);
  }

  /**
   * Get countries by region
   */
  getCountriesByRegion(region: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/region/${region}`);
  }

  /**
   * Get countries by subregion
   */
  getCountriesBySubregion(subregion: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.COUNTRIES_API_BASE}/subregion/${subregion}`);
  }

  // ==================== Helper Methods ====================

  /**
   * Generic GET request
   */
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  /**
   * Generic POST request
   */
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  /**
   * Generic PUT request
   */
  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  /**
   * Generic DELETE request
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}

// Made with Bob
