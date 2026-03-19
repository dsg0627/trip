package com.example;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;

public class App {
    private static final String RESOURCE_ROOT = "/site";
    private static final Map<String, String> ROUTES = new HashMap<>();

    static {
        ROUTES.put("/", "/index.html");
        ROUTES.put("/index.html", "/index.html");
        ROUTES.put("/attractions.html", "/attractions.html");
        ROUTES.put("/detail.html", "/detail.html");
        ROUTES.put("/about.html", "/about.html");
        ROUTES.put("/contact.html", "/contact.html");
    }

    public static void main(String[] args) throws IOException {
        int port = readPort();
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new StaticSiteHandler());
        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();

        System.out.println("Trip travel guide site is running on http://localhost:" + port);
    }

    private static int readPort() {
        String value = System.getenv("PORT");
        if (value == null || value.isBlank()) {
            return 8080;
        }

        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return 8080;
        }
    }

    private static class StaticSiteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            String resourcePath = resolvePath(requestPath);

            if (resourcePath == null) {
                sendNotFound(exchange);
                return;
            }

            try (InputStream input = App.class.getResourceAsStream(RESOURCE_ROOT + resourcePath)) {
                if (input == null) {
                    sendNotFound(exchange);
                    return;
                }

                byte[] body = input.readAllBytes();
                Headers headers = exchange.getResponseHeaders();
                headers.set("Content-Type", contentType(resourcePath));
                headers.set("Cache-Control", "no-cache");
                exchange.sendResponseHeaders(200, body.length);

                try (OutputStream output = exchange.getResponseBody()) {
                    output.write(body);
                }
            }
        }

        private String resolvePath(String requestPath) {
            if (requestPath == null || requestPath.isBlank()) {
                return "/index.html";
            }

            if (ROUTES.containsKey(requestPath)) {
                return ROUTES.get(requestPath);
            }

            if (requestPath.startsWith("/assets/") || requestPath.startsWith("/data/")) {
                return requestPath;
            }

            return null;
        }

        private void sendNotFound(HttpExchange exchange) throws IOException {
            byte[] body = "404 - Page Not Found".getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
            exchange.sendResponseHeaders(404, body.length);
            try (OutputStream output = exchange.getResponseBody()) {
                output.write(body);
            }
        }

        private String contentType(String path) {
            String mimeType = URLConnection.guessContentTypeFromName(path);
            if (mimeType == null) {
                if (path.endsWith(".js")) {
                    return "application/javascript; charset=UTF-8";
                }
                if (path.endsWith(".json")) {
                    return "application/json; charset=UTF-8";
                }
                if (path.endsWith(".css")) {
                    return "text/css; charset=UTF-8";
                }
                return "application/octet-stream";
            }

            if (mimeType.startsWith("text/") || mimeType.contains("javascript") || mimeType.contains("json")) {
                return mimeType + "; charset=UTF-8";
            }
            return mimeType;
        }
    }
}