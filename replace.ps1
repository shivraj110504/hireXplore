$files = Get-ChildItem -Path "d:\Code Vault\Projects\Job Portal\frontend\hirexplore\src" -Recurse -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Backgrounds
    $content = $content -replace 'bg-black/?\d*|bg-gray-950/?\d*|bg-neutral-950/?\d*', 'bg-bg-main'
    $content = $content -replace 'bg-gray-900/?\d*|bg-zinc-900/?\d*|bg-neutral-900/?\d*', 'bg-bg-card'
    $content = $content -replace 'bg-[#0f0f0f]', 'bg-bg-card'
    $content = $content -replace 'bg-gray-800/?\d*|bg-gray-700/?\d*|bg-gray-600/?\d*', 'bg-bg-hover'
    $content = $content -replace 'bg-white|bg-gray-100/?\d*|bg-gray-200/?\d*', 'bg-brand-primary'
    $content = $content -replace 'bg-[#050505]', 'bg-bg-nav'
    
    $content = $content -replace 'bg-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'bg-brand-primary'
    $content = $content -replace 'bg-green-\d{2,3}(/\d+)?', 'bg-status-success'
    $content = $content -replace 'bg-(yellow|amber)-\d{2,3}(/\d+)?', 'bg-status-warning'
    $content = $content -replace 'bg-(red|rose|pink)-\d{2,3}(/\d+)?', 'bg-status-error'

    # Text
    $content = $content -replace 'text-white|text-black', 'text-text-primary'
    $content = $content -replace 'text-(gray|neutral|zinc)-200/?\d*', 'text-text-secondary'
    $content = $content -replace 'text-(gray|neutral|zinc)-[3456]00/?\d*', 'text-text-muted'
    
    $content = $content -replace 'text-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'text-brand-primary'
    $content = $content -replace 'text-green-\d{2,3}(/\d+)?', 'text-status-success'
    $content = $content -replace 'text-(yellow|amber)-\d{2,3}(/\d+)?', 'text-status-warning'
    $content = $content -replace 'text-(red|rose|pink)-\d{2,3}(/\d+)?', 'text-status-error'

    # Borders
    $content = $content -replace 'border-(gray|neutral|zinc|white|black)-\d{2,3}(/\d+)?', 'border-border-default'
    $content = $content -replace 'border-white/?\d*', 'border-border-default'
    $content = $content -replace 'border-gray-900', 'border-border-default'
    $content = $content -replace 'border-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'border-border-focus'
    $content = $content -replace 'border-green-\d{2,3}(/\d+)?', 'border-status-success'
    $content = $content -replace 'border-(yellow|amber)-\d{2,3}(/\d+)?', 'border-status-warning'
    $content = $content -replace 'border-(red|rose|pink)-\d{2,3}(/\d+)?', 'border-status-error'

    # Gradients
    $content = $content -replace 'from-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'from-brand-primary'
    $content = $content -replace 'to-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'to-brand-secondary'
    $content = $content -replace 'via-(blue|cyan|indigo|purple|fuchsia)-\d{2,3}(/\d+)?', 'via-brand-accent'
    
    $content = $content -replace 'from-(black|gray-\d{2,3})', 'from-bg-main'
    $content = $content -replace 'to-(black|gray-\d{2,3})', 'to-bg-main'
    $content = $content -replace 'via-(black|gray-\d{2,3})', 'via-bg-main'

    # Shadows
    $content = $content -replace 'shadow-\[0_0_\d+px_rgba\(6,182,212,0\.\d+\)\]', 'shadow-[0_0_40px_var(--color-brand-primary)]'
    
    if ($content -ne $null) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}
Write-Output "Completed replacement script."
