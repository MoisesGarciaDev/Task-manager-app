<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_task()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'Description test',
            'is_private' => true
        ]);
        
        $response->assertStatus(201)
                ->assertJsonFragment(['title' => 'Test Task']); 
        
        $this->assertDatabaseHas('tasks', ['title' => 'Test Task']);
    }

    public function test_user_can_access_public_task_without_login()
    {
        $task = Task::factory()->create([
            'is_private' => false
        ]);

        $response = $this->getJson("/api/tasks/public/{$task->share_token}");

        $response->assertStatus(200)
                 ->assertJsonPath('id', $task->id);
    }

    public function test_user_cannot_access_private_task_without_login()
    {
        $task = Task::factory()->create([
            'is_private' => true
        ]);

        $response = $this->getJson("/api/tasks/public/{$task->share_token}");

        $response->assertStatus(404);
    }
}