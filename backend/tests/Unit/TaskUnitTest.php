<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; 

class TaskUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_generates_share_token_automatically()
    {
        $user = User::factory()->create();
        $task = Task::create([
            'title' => 'Unit Task',
            'user_id' => $user->id,
            'is_private' => true
        ]);

        $this->assertNotNull($task->share_token);
        $this->assertEquals(32, strlen($task->share_token)); 
    }
}