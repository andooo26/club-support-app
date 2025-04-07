// app/project/page.tsx

'use client'; // クライアントコンポーネントとして指定

import React, { useState, useEffect } from "react";
import Header from "../components/Header";

type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [newProjectName, setNewProjectName] = useState(""); // 新しいプロジェクト名
  const [newProjectDescription, setNewProjectDescription] = useState(""); // 新しいプロジェクトの説明
  useEffect(() => {
    // ここでプロジェクト一覧を取得するロジックを追記
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/project", {
          method: "GET",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(`エラー: ${errorData.error}`);
          return;
        }
  
        const projects = await response.json();
        setProjects(projects); // プロジェクト一覧を状態に設定
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("プロジェクト一覧の取得中にエラーが発生しました。");
      }
    };
  
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    // モーダルを開く
    setIsModalOpen(true);
  };

  const handleSaveProject = async () => {
    // プロジェクト作成のロジックや画面遷移を追加
    if (newProjectName.trim() === "") {
      alert("プロジェクト名を入力してください");
      return;
    }

    try {
      
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newProjectName,newProjectDescription}), // ユーザーのメールアドレスを含める
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
        return;
      }
    
      const savedProject = await response.json();
      
      console.log("Saved Project:", savedProject); // デバッグ用
    setProjects([...projects, savedProject]); // 新しいプロジェクトをリストに追加
    
    setNewProjectName(""); // プロジェクト名フィールドをリセット
    setNewProjectDescription(""); // 説明フィールドをリセット
    setIsModalOpen(false); // モーダルを閉じる
  } catch (error) {
    console.error("Error saving project:", error);
    alert("プロジェクトの保存中にエラーが発生しました。");
  }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // モーダルを閉じる
  };

  const handleDetailProject = (projectId: number) => {
    // プロジェクト詳細画面に遷移するロジックを追加 
    // 例: router.push(`/project/${projectId}`);
    alert(`プロジェクトID: ${projectId} の詳細画面に遷移`);
  }

  return (
    <div className="pt-20 px-4">
      <Header />
      <title>プロジェクト一覧</title>
      <h1 className="text-xl font-bold mb-4">所属しているプロジェクト</h1>
      <ul>
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-white p-4 shadow-md rounded mb-2">
            <li className="text-lg font-bold">{project.name}</li>
            <p className="text-sm text-gray-600">{project.description}</p>
            <button
            onClick={() => handleDetailProject(project.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded">
              プロジェクト詳細
            </button>
          </div>
        ))}
      </ul>
      <button
        onClick={handleCreateProject}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        プロジェクトを作成する
      </button>

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-lg font-bold mb-4">新しいプロジェクトを作成</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="プロジェクト名を入力"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="プロジェクトの説明を入力"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveProject}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}