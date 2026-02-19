import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";

const mockResults = [
  { article: "100.1242.52", original: "1K0 615 301 M", brand: "Zimmermann", name: "Диск тормозной передний VW Golf V/VI", price: "1 850 ₴", stock: 4, delivery: "В наличии" },
  { article: "100.1243.52", original: "1K0 615 301 AA", brand: "Zimmermann", name: "Диск тормозной передний VW Golf V/VI (перфорация)", price: "2 340 ₴", stock: 2, delivery: "В наличии" },
  { article: "150.2906.52", original: "8E0 615 301 Q", brand: "Zimmermann", name: "Диск тормозной передний Audi A4 B6/B7", price: "2 100 ₴", stock: 0, delivery: "2-3 дня" },
  { article: "400.3607.20", original: "34 11 6 855 000", brand: "Zimmermann", name: "Диск тормозной передний BMW F30/F31", price: "3 450 ₴", stock: 1, delivery: "В наличии" },
  { article: "230.2356.52", original: "A 211 421 12 12", brand: "Zimmermann", name: "Диск тормозной передний Mercedes W211", price: "2 780 ₴", stock: 0, delivery: "5-7 дней" },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(mockResults);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setSearched(true);
      setResults(
        mockResults.filter(
          (r) =>
            r.article.toLowerCase().includes(query.toLowerCase()) ||
            r.original.toLowerCase().includes(query.toLowerCase().replace(/\s/g, "")) ||
            r.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Поиск артикулов</h1>
          <p className="text-sm text-muted-foreground">Поиск по каталогу Zimmermann и оригинальным номерам</p>
        </div>

        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Артикул Zimmermann или OEM номер..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Найти</Button>
        </div>

        {/* Results */}
        {(searched || !query) && (
          <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Артикул</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">OEM</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Наименование</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Цена</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Наличие</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Доставка</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(searched ? results : mockResults).map((item) => (
                  <tr key={item.article} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary">{item.article}</td>
                    <td className="px-5 py-3.5 text-sm font-mono text-muted-foreground">{item.original}</td>
                    <td className="px-5 py-3.5 text-sm text-card-foreground">{item.name}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-semibold text-card-foreground">{item.price}</td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={item.stock > 0 ? "default" : "secondary"} className="text-xs">
                        {item.stock > 0 ? `${item.stock} шт` : "Нет"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.delivery}</td>
                    <td className="px-3 py-3.5">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ShoppingCart size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {searched && results.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm">Ничего не найдено по запросу "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </CrmLayout>
  );
};

export default SearchPage;
