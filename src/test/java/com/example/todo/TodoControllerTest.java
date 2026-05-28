package com.example.todo;

import com.example.todo.controller.TodoController;
import com.example.todo.model.Task;
import com.example.todo.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ui.ExtendedModelMap;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoControllerTest {

    @Mock
    TaskRepository taskRepository;

    @InjectMocks
    TodoController controller;

    @Test
    void タスク一覧画面を返す() {
        when(taskRepository.findAll()).thenReturn(List.of());

        String view = controller.index(new ExtendedModelMap());

        assertEquals("index", view);
    }

    @Test
    void タスクを作成してリダイレクトする() {
        String result = controller.createTask("買い物");

        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals("redirect:/", result);
    }

    @Test
    void タイトルが空の場合はタスクを保存しない() {
        controller.createTask("   ");

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void タスクの完了状態をトグルする() {
        Task task = new Task();
        task.setTitle("テスト");
        task.setCompleted(false);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        controller.toggleTask(1L);

        verify(taskRepository, times(1)).save(task);
        assertEquals(true, task.isCompleted());
    }

    @Test
    void タスクを削除してリダイレクトする() {
        String result = controller.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
        assertEquals("redirect:/", result);
    }
}
