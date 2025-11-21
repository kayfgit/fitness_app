import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AppState } from "react-native";
import { loadObject, saveObject } from "../lib/storage";

export type QuestGoal = {
    id: string;
    exercise: string;
    target: number;
    unit?: string;
    current: number;
};

export type Quest = {
    id: string;
    title: string;
    goals: QuestGoal[];
};

type QuestsState = {
    quests: Quest[];
    activeQuestId: string | null;
    activeQuest: Quest | null;
    addQuest: (q: Quest) => void;
    updateQuest: (q: Quest) => void;
    deleteQuest: (id: string) => void;
    setActiveQuestId: (id: string | null) => void;
    createQuest: (title?: string) => Quest;
    updateGoalProgress: (
        questId: string,
        goalId: string,
        newProgress: number
    ) => void;
    isQuestCompletedToday: (questId: string) => boolean;
    uncompleteQuest: (questId: string) => void;
};

const STORAGE_KEY = "quests_state_v1";
const QUEST_COMPLETION_KEY = "quest_completion_v1";

const QuestsContext = createContext<QuestsState | undefined>(undefined);

type Persisted = {
    quests: Quest[];
    activeQuestId: string | null;
    lastActiveDate?: string;
};

function generateId(prefix: string = "id"): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getTodayLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const QuestsProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
    const [questCompletion, setQuestCompletion] = useState<
        Record<string, string>
    >({});

    const persist = useCallback(
        async (nextQuests: Quest[], nextActive: string | null) => {
            await saveObject<Persisted>(STORAGE_KEY, {
                quests: nextQuests,
                activeQuestId: nextActive,
                lastActiveDate: getTodayLocalDateString(),
            });
        },
        []
    );

    const checkDailyReset = useCallback(async () => {
        const today = getTodayLocalDateString();
        const persisted = await loadObject<Persisted>(STORAGE_KEY);
        const lastDate = persisted?.lastActiveDate || today;

        if (lastDate < today) {
            console.log("Performing daily reset...");

            // Reset all quests
            setQuests((prevQuests) => {
                const resetQuestsList = prevQuests.map((quest) => ({
                    ...quest,
                    goals: quest.goals.map((g) => ({ ...g, current: 0 })),
                }));

                // We need to save this immediately, but we can't use 'persist' easily inside setState
                // without potentially stale closures if we are not careful.
                // However, since we are inside a callback that will trigger a re-render,
                // we can just save the result.
                // Actually, let's just calculate the new state and set it, then save.
                return resetQuestsList;
            });

            // We need to access the *new* quests to save them, but setState is async.
            // So we should probably do the calculation first.
            // Re-reading 'quests' from state might be stale if this is called from an effect?
            // But 'checkDailyReset' depends on 'quests'.

            // Let's do it this way:
            // We will force a reload from storage to be safe, OR just use the current 'quests' dependency.
            // Using 'quests' dependency is fine.

            const resetQuestsList = quests.map((quest) => ({
                ...quest,
                goals: quest.goals.map((g) => ({ ...g, current: 0 })),
            }));

            setQuests(resetQuestsList);

            // Cleanup completion records
            const completion = await loadObject<Record<string, string>>(QUEST_COMPLETION_KEY) || {};
            const newCompletion = { ...completion };
            let needsUpdate = false;
            for (const questId in newCompletion) {
                if (newCompletion[questId] < today) {
                    delete newCompletion[questId];
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                setQuestCompletion(newCompletion);
                await saveObject(QUEST_COMPLETION_KEY, newCompletion);
            }

            // Save everything with today's date
            await saveObject<Persisted>(STORAGE_KEY, {
                quests: resetQuestsList,
                activeQuestId: activeQuestId,
                lastActiveDate: today,
            });
        }
    }, [quests, activeQuestId]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === "active") {
                checkDailyReset();
            }
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        // Check every 10 seconds to handle manual time changes or app open at midnight
        const interval = setInterval(() => {
            checkDailyReset();
        }, 10000);

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, [checkDailyReset]);

    useEffect(() => {
        (async () => {
            try {
                const persisted = await loadObject<Persisted>(STORAGE_KEY);
                const completion = await loadObject<Record<string, string>>(
                    QUEST_COMPLETION_KEY
                );

                if (completion) {
                    setQuestCompletion(completion);
                }

                if (persisted) {
                    const today = getTodayLocalDateString();
                    const lastDate = persisted.lastActiveDate || today;

                    let loadedQuests = persisted.quests;

                    // If it's a new day, reset immediately on load
                    if (lastDate < today) {
                        loadedQuests = loadedQuests.map((quest) => ({
                            ...quest,
                            goals: quest.goals.map((g) => ({ ...g, current: 0 })),
                        }));

                        // Cleanup completion
                        if (completion) {
                            const newCompletion = { ...completion };
                            let needsUpdate = false;
                            for (const questId in newCompletion) {
                                if (newCompletion[questId] < today) {
                                    delete newCompletion[questId];
                                    needsUpdate = true;
                                }
                            }
                            if (needsUpdate) {
                                setQuestCompletion(newCompletion);
                                await saveObject(QUEST_COMPLETION_KEY, newCompletion);
                            }
                        }

                        // Save the reset state immediately
                        await saveObject<Persisted>(STORAGE_KEY, {
                            quests: loadedQuests,
                            activeQuestId: persisted.activeQuestId,
                            lastActiveDate: today,
                        });
                    }

                    setQuests(loadedQuests);
                    setActiveQuestId(persisted.activeQuestId || null);

                } else {
                    // seed with a default quest for first run
                    const seed: Quest = {
                        id: generateId("quest"),
                        title: "DAILY QUEST - TRAIN TO BECOME\nA FORMIDABLE COMBATANT",
                        goals: [
                            {
                                id: generateId("g"),
                                exercise: "PUSH-UPS",
                                current: 0,
                                target: 100,
                            },
                            {
                                id: generateId("g"),
                                exercise: "SIT-UPS",
                                current: 0,
                                target: 100,
                            },
                            {
                                id: generateId("g"),
                                exercise: "SQUATS",
                                current: 0,
                                target: 100,
                            },
                            {
                                id: generateId("g"),
                                exercise: "RUN",
                                current: 0,
                                target: 10,
                                unit: "KM",
                            },
                        ],
                    };
                    setQuests([seed]);
                    setActiveQuestId(seed.id);
                    // Initial save
                    await saveObject<Persisted>(STORAGE_KEY, {
                        quests: [seed],
                        activeQuestId: seed.id,
                        lastActiveDate: getTodayLocalDateString(),
                    });
                }
            } catch (e) {
                console.error("Failed to load quests:", e);
            }
        })();
    }, []);

    const addQuest = useCallback(
        (q: Quest) => {
            setQuests((prev) => {
                const next = [...prev, q];
                void persist(next, activeQuestId);
                return next;
            });
        },
        [activeQuestId, persist]
    );

    const updateQuest = useCallback(
        (q: Quest) => {
            setQuests((prev) => {
                const next = prev.map((it) => (it.id === q.id ? q : it));
                void persist(next, activeQuestId);
                return next;
            });
        },
        [activeQuestId, persist]
    );

    const deleteQuest = useCallback(
        (id: string) => {
            setQuests((prev) => {
                const next = prev.filter((q) => q.id !== id);
                const nextActive =
                    activeQuestId === id ? (next[0]?.id ?? null) : activeQuestId;
                setActiveQuestId(nextActive);
                void persist(next, nextActive);
                return next;
            });
        },
        [activeQuestId, persist]
    );

    const setActive = useCallback(
        (id: string | null) => {
            setActiveQuestId(() => {
                void persist(quests, id);
                return id;
            });
        },
        [persist, quests]
    );

    const createQuest = useCallback(
        (title?: string): Quest => {
            const q: Quest = {
                id: generateId("quest"),
                title: title || "NEW QUEST",
                goals: [
                    { id: generateId("g"), exercise: "PUSH-UPS", current: 0, target: 10 },
                ],
            };
            addQuest(q);
            return q;
        },
        [addQuest]
    );

    const updateGoalProgress = useCallback(
        (questId: string, goalId: string, newProgress: number) => {
            setQuests((prev) => {
                const next = prev.map((quest) => {
                    if (quest.id === questId) {
                        return {
                            ...quest,
                            goals: quest.goals.map((goal) =>
                                goal.id === goalId ? { ...goal, current: newProgress } : goal
                            ),
                        };
                    }
                    return quest;
                });
                void persist(next, activeQuestId);
                return next;
            });
        },
        [activeQuestId, persist]
    );

    const isQuestCompletedToday = useCallback(
        (questId: string): boolean => {
            const today = getTodayLocalDateString();
            if (questCompletion[questId] !== today) {
                return false;
            }

            const quest = quests.find((q) => q.id === questId);
            if (!quest) {
                return false;
            }
            const allGoalsMet = quest.goals.every((g) => g.current >= g.target);

            return allGoalsMet;
        },
        [questCompletion, quests]
    );

    const completeQuest = useCallback(
        async (questId: string) => {
            const today = getTodayLocalDateString();
            const newCompletion = { ...questCompletion, [questId]: today };
            setQuestCompletion(newCompletion);
            await saveObject(QUEST_COMPLETION_KEY, newCompletion);
        },
        [questCompletion]
    );

    const uncompleteQuest = useCallback(
        async (questId: string) => {
            const newCompletion = { ...questCompletion };
            delete newCompletion[questId];
            setQuestCompletion(newCompletion);
            await saveObject(QUEST_COMPLETION_KEY, newCompletion);
        },
        [questCompletion]
    );

    const activeQuest = useMemo(
        () => quests.find((q) => q.id === activeQuestId) || null,
        [quests, activeQuestId]
    );

    const value = useMemo<QuestsState>(
        () => ({
            quests,
            activeQuestId,
            activeQuest,
            addQuest,
            updateQuest,
            deleteQuest,
            setActiveQuestId: setActive,
            createQuest,
            updateGoalProgress,
            isQuestCompletedToday,
            completeQuest,
            uncompleteQuest,
        }),
        [
            quests,
            activeQuestId,
            activeQuest,
            addQuest,
            updateQuest,
            deleteQuest,
            setActive,
            createQuest,
            updateGoalProgress,
            isQuestCompletedToday,
            completeQuest,
            uncompleteQuest,
        ]
    );

    return (
        <QuestsContext.Provider value={value}>{children}</QuestsContext.Provider>
    );
};

export function useQuests(): QuestsState {
    const ctx = useContext(QuestsContext);
    if (!ctx) throw new Error("useQuests must be used within QuestsProvider");
    return ctx;
}
