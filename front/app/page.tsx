"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Topic = {
  id: number;
  name: string;
  postsCount: number;
  popularityScore: number;
  createdAt: string;
};

export default function SubjectsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

  // Fonction pour fetch les topics
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3000/topics");
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      console.error("error fetchin topics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await fetch("http://127.0.0.1:3000/scraper", { method: "POST" });
      await fetchTopics();
    } catch (err) {
      console.error("Erreur scraping:", err);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sujets réglementaires</h1>
        <Button
          onClick={handleScrape}
          disabled={scraping}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {scraping ? "Scraping..." : "Lancer le scraping"}
        </Button>
      </div>

      {loading ? (
        <p>Chargement des topics...</p>
      ) : topics.length === 0 ? (
        <p>Aucun topic trouvé</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/feed/${topic.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{topic.name}</CardTitle>
                  <CardDescription>
                    {topic.postsCount} posts • Popularité:{" "}
                    {topic.popularityScore.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Cliquez pour voir le flux</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
