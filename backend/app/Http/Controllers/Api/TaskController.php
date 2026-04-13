<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTaskRequest;
use App\Http\Requests\Api\UpdateTaskRequest;
use App\Http\Resources\Api\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = $request->user()->tasks();

        if ($request->has('is_completed')) {
            $query->where('is_completed', $request->boolean('is_completed'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Paginate genera la estructura { data: [], meta: [] }
        $tasks = $query->orderBy('created_at', 'desc')->paginate(6);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => $request->is_completed ?? false,
            'is_private' => $request->is_private ?? true,
            'share_token' => Str::random(10),
        ]);

        return (new TaskResource($task))->additional([
            'message' => 'Task created successfully'
        ]);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $task->update($request->validated());

        return (new TaskResource($task))->additional([
            'message' => 'Task updated successfully'
        ]);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ], 200);
    }

    public function showPublic($token)
    {
        $task = Task::where('share_token', $token)
                    ->where('is_private', false)
                    ->first();
        
        if (!$task) {
            return response()->json(['message' => 'Task not found or private.'], 404);
        }

        return response()->json($task);
    }
}