# n8n + OpenAI Integration Guide

## 🤖 Setting Up OpenAI Credentials in n8n

This guide walks you through adding OpenAI credentials to n8n for AI-powered content generation workflows.

---

## 📋 Prerequisites

- ✅ n8n instance running (local or cloud)
- ✅ OpenAI account with API access
- ✅ Valid OpenAI API key

---

## 🔑 Step 1: Get Your OpenAI API Key

### Option A: Create New API Key

1. Go to **https://platform.openai.com/account/api-keys**
2. Click **"+ Create new secret key"**
3. Give it a name (e.g., "n8n-codev-media")
4. Click **"Create secret key"**
5. **IMPORTANT:** Copy the key immediately - you won't be able to see it again!
6. Store it securely (password manager recommended)

### Option B: Use Existing API Key

If you already have an API key:
1. Go to **https://platform.openai.com/account/api-keys**
2. Locate your existing key
3. If you can't see the full key, create a new one

**API Key Format:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔧 Step 2: Add Credentials in n8n

### 2.1 Navigate to Credentials

1. Open your **n8n** instance
   - Local: http://localhost:5678
   - Cloud: https://your-instance.app.n8n.cloud

2. Click on your **user icon** (top right)
3. Select **"Settings"** from the dropdown
4. Click **"Credentials"** in the left sidebar

### 2.2 Create OpenAI Credential

1. Click the **"+ Add Credential"** button (top right)
2. In the search box, type **"OpenAI"**
3. Select **"OpenAI API"** from the results
4. Click on it to open the credential form

### 2.3 Configure Credential

Fill in the following fields:

**Credential Name:**
```
OpenAI - Codev Media
```
(Or any name that helps you identify it)

**API Key:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
(Paste your actual OpenAI API key)

**Optional Fields:**
- **Organization ID:** Leave empty (unless you have a specific org ID)
- **Resource:** Default (no changes needed)

### 2.4 Test Connection

1. Click the **"Test"** button (bottom right)
2. Wait for the test to complete
3. Look for the success message:
   ```
   ✅ Connection test successful
   ```

**If Test Fails:**
- ❌ "Invalid API key" → Check your API key is correct
- ❌ "Insufficient credits" → Add credits to your OpenAI account
- ❌ "Network error" → Check your internet connection

### 2.5 Save Credential

1. Click **"Save"** (bottom right)
2. The credential will appear in your credentials list
3. You can now use it in any workflow!

---

## ✅ Verification Checklist

Use this checklist to confirm your setup:

### Pre-Setup
- [ ] I have an OpenAI account
- [ ] I have access to OpenAI API keys page
- [ ] I have my API key ready (starts with `sk-`)

### n8n Configuration
- [ ] Opened n8n instance
- [ ] Navigated to Settings → Credentials
- [ ] Created new "OpenAI API" credential
- [ ] Entered credential name: "OpenAI - Codev Media"
- [ ] Pasted OpenAI API key
- [ ] Clicked "Test" button
- [ ] Saw "Connection test successful" message
- [ ] Clicked "Save" to store credential

### Post-Setup
- [ ] Credential appears in credentials list
- [ ] Can select credential in OpenAI nodes
- [ ] Ready to create AI workflows!

---

## 🚀 Quick Test Workflow

Create a simple workflow to verify everything works:

### Test Workflow Steps:

1. **Create New Workflow**
   - Click "+ Add Workflow" in n8n
   - Name it "OpenAI Test"

2. **Add Manual Trigger**
   - Click "+" to add a node
   - Search for "Manual Trigger"
   - Add it to the canvas

3. **Add OpenAI Node**
   - Click "+" after the trigger
   - Search for "OpenAI"
   - Select "OpenAI" node
   - Operation: "Text" → "Complete"

4. **Configure OpenAI Node**
   - **Credentials:** Select "OpenAI - Codev Media"
   - **Model:** gpt-3.5-turbo (or gpt-4)
   - **Prompt:** 
     ```
     Write a short blog post title about AI and content creation
     ```

5. **Test the Workflow**
   - Click "Test Workflow" (top right)
   - Wait for execution
   - Check output - should see AI-generated title

**Expected Output:**
```json
{
  "choices": [
    {
      "message": {
        "content": "10 Ways AI is Revolutionizing Content Creation in 2025"
      }
    }
  ]
}
```

✅ If you see AI-generated content, your setup is working!

---

## 🔗 Example: AI Blog Post Generation Workflow

Now that OpenAI is configured, create a workflow to generate blog posts for Codev Media:

### Workflow Structure:

```
[Schedule Trigger] 
    ↓
[OpenAI: Generate Title]
    ↓
[OpenAI: Generate Content]
    ↓
[Format as Lexical JSON]
    ↓
[HTTP Request: POST to /api/webhook/new-post]
```

### Sample OpenAI Prompts:

**Title Generation:**
```
Generate a compelling blog post title about web development, 
Next.js, or content management systems. Make it engaging and SEO-friendly.
```

**Content Generation:**
```
Write a 500-word blog post with the title: "{{$json["title"]}}"

Include:
- Introduction paragraph
- 3-4 main points with explanations
- Practical examples
- Conclusion with call-to-action

Write in a friendly, professional tone suitable for developers.
```

---

## 💡 Usage Tips

### Best Practices

1. **API Key Security**
   - Never share your API key
   - Never commit it to version control
   - Rotate keys periodically
   - Use separate keys for dev/prod

2. **Cost Management**
   - Set usage limits in OpenAI dashboard
   - Monitor API usage regularly
   - Use cheaper models for testing (gpt-3.5-turbo)
   - Cache responses when possible

3. **Model Selection**
   - **gpt-3.5-turbo:** Fast, cheap, good for most tasks
   - **gpt-4:** More accurate, better for complex content
   - **gpt-4-turbo:** Balance of speed and quality

### Common Issues & Solutions

**Issue: "Rate limit exceeded"**
- Solution: Wait a few minutes or upgrade your OpenAI plan

**Issue: "Insufficient quota"**
- Solution: Add credits to your OpenAI account

**Issue: "Invalid request"**
- Solution: Check your prompt format and parameters

**Issue: "Timeout"**
- Solution: Reduce prompt length or increase timeout in n8n

---

## 📊 OpenAI Models Available

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| gpt-3.5-turbo | Fast | $ | Quick content, summaries |
| gpt-4 | Slow | $$$ | Complex content, analysis |
| gpt-4-turbo | Medium | $$ | Balanced performance |
| gpt-4o | Fast | $$ | Multimodal tasks |

**Pricing:** Check current rates at https://openai.com/pricing

---

## 🔐 Security Recommendations

### For Production:

1. **Environment Variables**
   - Store API key in n8n environment variables
   - Never hardcode in workflows

2. **Access Control**
   - Limit who can view/edit credentials in n8n
   - Use role-based access control

3. **Monitoring**
   - Enable logging for API calls
   - Set up alerts for unusual usage
   - Review API usage weekly

4. **Backup**
   - Document all credential names
   - Keep list of which workflows use which credentials
   - Have a key rotation plan

---

## 🎯 Next Steps

Now that OpenAI is configured:

1. **Create AI Content Workflow**
   - Use OpenAI to generate blog post titles
   - Generate content based on topics
   - Format output as Lexical JSON

2. **Connect to Codev Media**
   - Send generated content to `/api/webhook/new-post`
   - Include author_id if needed
   - Set status to 'draft' for review

3. **Automate Publishing**
   - Schedule weekly content generation
   - Create content calendar
   - Auto-publish approved posts

4. **Enhance Workflows**
   - Add content editing/refinement
   - Include SEO optimization
   - Generate featured images with DALL-E

---

## ✅ Setup Complete!

Your n8n instance is now connected to OpenAI and ready to:
- ✅ Generate blog post titles
- ✅ Create article content
- ✅ Write product descriptions
- ✅ Generate social media posts
- ✅ Automate content creation for Codev Media

**What's Next?**
Check out `WEBHOOK_GUIDE.md` to connect your n8n workflows to the Codev Media CMS!

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [n8n OpenAI Node Documentation](https://docs.n8n.io/integrations/builtin/credentials/openai/)
- [OpenAI Playground](https://platform.openai.com/playground) - Test prompts
- [OpenAI Pricing](https://openai.com/pricing) - Current rates
- [Codev Media Webhook Guide](./WEBHOOK_GUIDE.md) - Integration guide

---

**Last Updated:** October 18, 2025  
**Status:** Ready for AI-powered content generation! 🤖✨

