import { Translations } from '@/types/tool';

export const translations: Translations = {
  en: {
    common: {
      title: 'IT Tool Nexus',
      subtitle: 'Professional IT Tools Collection',
      description: 'Modern, powerful, and easy-to-use IT tools for developers and system administrators',
      home: 'Home',
      tools: 'Tools',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      copy: 'Copy',
      paste: 'Paste',
      clear: 'Clear',
      reset: 'Reset',
      generate: 'Generate',
      convert: 'Convert',
      compare: 'Compare',
      calculate: 'Calculate',
      encode: 'Encode',
      decode: 'Decode',
      input: 'Input',
      output: 'Output',
      result: 'Result',
      success: 'Success',
      error: 'Error',
      copied: 'Copied to clipboard',
      github: 'View on GitHub',
      search: 'Search tools...',
      searchPlaceholder: 'Search by tool name or description',
      suggestNewTool: 'Suggest New Tool',
      noToolsFound: 'No tools found matching your search',
      privacyNotice: 'Privacy Notice',
      privacyDescription: 'All data processing is performed locally in your browser. No data is transmitted to our servers, ensuring your privacy and security.'
    },
    categories: {
      hash: 'Hash & Encoding',
      generator: 'Generators',
      converter: 'Converters',
      diff: 'Comparison Tools',
      network: 'Network Tools',
      'data-processing': 'Data Processing'
    },
    tools: {
      textHash: {
        name: 'Text Hash',
        description: 'Convert text to various hash algorithms (MD5, SHA1, Base64, etc.)',
        placeholder: 'Enter text to hash...'
      },
      uuidGenerator: {
        name: 'UUID Generator',
        description: 'Generate UUIDs with different versions (v1, v4) and quantities',
        generateMultiple: 'Generate Multiple',
        version: 'Version',
        quantity: 'Quantity'
      },
      textDiff: {
        name: 'Text Diff',
        description: 'Compare two text strings with visual diff highlighting',
        original: 'Original Text',
        modified: 'Modified Text'
      },
      jsonDiff: {
        name: 'JSON Diff',
        description: 'Compare JSON objects with structured difference highlighting',
        originalJson: 'Original JSON',
        modifiedJson: 'Modified JSON'
      },
      jsonXmlConverter: {
        name: 'JSON ↔ XML',
        description: 'Convert between JSON and XML formats bidirectionally',
        jsonToXml: 'JSON to XML',
        xmlToJson: 'XML to JSON'
      },
      urlEncoder: {
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URLs with proper formatting',
        urlToEncode: 'URL to Encode',
        urlToDecode: 'URL to Decode'
      },
      yamlTomlConverter: {
        name: 'YAML ↔ TOML',
        description: 'Convert between YAML and TOML formats with syntax highlighting and validation. Supports complex data structures, arrays, and nested objects with customizable formatting options.',
        yamlToToml: 'YAML to TOML',
        tomlToYaml: 'TOML to YAML'
      },
      subnetCalculator: {
        name: 'Subnet Calculator',
        description: 'Calculate network subnets, CIDR, and IP ranges',
        ipAddress: 'IP Address',
        subnetMask: 'Subnet Mask',
        cidrNotation: 'CIDR Notation'
      },
      qrGenerator: {
        name: 'QR Code Generator',
        description: 'Generate QR codes from text or URLs with customizable colors and error correction',
        inputText: 'Text or URL',
        inputPlaceholder: 'Enter text or URL to generate QR code...',
        foregroundColor: 'Foreground Color',
        backgroundColor: 'Background Color',
        errorCorrectionLevel: 'Error Correction Level',
        generate: 'Generate QR Code',
        download: 'Download QR Code',
        success: 'Success',
        error: 'Error',
        generateSuccess: 'QR code generated successfully',
        generateError: 'Failed to generate QR code',
        downloadSuccess: 'QR code downloaded successfully',
        emptyInputError: 'Please enter text or URL',
        noQrCodeError: 'Please generate QR code first',
        errorLevel: {
          L: 'L (~7% recovery)',
          M: 'M (~15% recovery)',
          Q: 'Q (~25% recovery)',
          H: 'H (~30% recovery)'
        }
      },
      dnsQuery: {
        name: 'DNS Query Tool',
        description: 'Query DNS records using DoH (DNS over HTTPS)',
        domain: 'Domain Name',
        domainPlaceholder: 'Enter domain name (e.g., example.com)',
        recordType: 'Record Type',
        provider: 'DoH Provider',
        query: 'Query DNS',
        querying: 'Querying...',
        querySettings: 'Query Settings',
        querySettingsDescription: 'Configure your DNS query parameters',
        results: 'Query Results',
        answers: 'Answer Records',
        authority: 'Authority Records',
        additional: 'Additional Records',
        authenticated: 'DNSSEC Verified',
        noRecords: 'No records found',
        querySuccess: 'DNS query completed successfully',
        queryError: 'Failed to query DNS records',
        queryFailed: 'Query failed with status',
        emptyDomainError: 'Please enter a domain name',
        invalidDomainError: 'Please enter a valid domain name',
        unknownError: 'Unknown error occurred',
        statusCodes: {
          '1': 'Format Error',
          '2': 'Server Failure',
          '3': 'Name Error (NXDOMAIN)',
          '4': 'Not Implemented',
          '5': 'Refused'
        }
      },
      xmlValidator: {
        name: 'XML Validator',
        description: 'Validate XML documents against XSD schemas with detailed error reporting',
        title: 'XML Validator',
        xsdSchema: 'XSD Schema',
        xmlDocument: 'XML Document',
        textInput: 'Text Input',
        fileUpload: 'File Upload',
        xsdPlaceholder: 'Paste your XSD schema here...',
        xmlPlaceholder: 'Paste your XML document here...',
        uploadXsd: 'Click to upload XSD file',
        uploadXml: 'Click to upload XML file',
        validate: 'Validate XML',
        validating: 'Validating...',
        clearAll: 'Clear All',
        validationResults: 'Validation Results',
        valid: 'Valid',
        invalid: 'Invalid',
        issuesFound: 'issue(s) found',
        error: 'Error',
        warning: 'Warning',
        line: 'Line',
        column: 'Column'
      },
      mermaidRenderer: {
        name: 'Mermaid Diagram Renderer',
        description: 'Create and render Mermaid diagrams with syntax highlighting and templates',
        controls: 'Controls',
        controlsDesc: 'Select templates and manage your diagram',
        template: 'Template',
        editor: 'Code Editor',
        editorDesc: 'Edit your Mermaid diagram code',
        preview: 'Preview',
        previewDesc: 'Live preview of your diagram',
        fullWidthPreview: 'Full Width Preview',
        syntaxHighlight: 'Syntax Highlighting',
        codePlaceholder: 'Enter your Mermaid diagram code here...',
        copyCode: 'Copy Code',
        downloadSvg: 'Download SVG',
        reset: 'Reset',
        fullWidth: 'Full Width',
        normalWidth: 'Normal Width',
        rendering: 'Rendering',
        rendered: 'Rendered',
        renderError: 'Render Error',
        noPreview: 'Enter code to see preview',
        copySuccess: 'Code Copied',
        copySuccessDesc: 'Mermaid code copied to clipboard',
        copyError: 'Copy Failed',
        copyErrorDesc: 'Failed to copy code to clipboard',
        downloadSuccess: 'Download Complete',
        downloadSuccessDesc: 'SVG file downloaded successfully'
      },
      httpRequestBuilder: {
        name: 'HTTP Request Builder',
        description: 'Build and send HTTP requests with custom headers, body, and view formatted responses',
        request: 'Request',
        response: 'Response',
        history: 'History',
        presets: 'Presets',
        method: 'Method',
        url: 'URL',
        urlPlaceholder: 'Enter request URL...',
        headers: 'Headers',
        addHeader: 'Add Header',
        key: 'Key',
        value: 'Value',
        body: 'Body',
        bodyPlaceholder: 'Enter request body...',
        contentType: 'Content Type',
        send: 'Send Request',
        sending: 'Sending...',
        status: 'Status',
        responseTime: 'Response Time',
        responseSize: 'Size',
        responseHeaders: 'Response Headers',
        responseBody: 'Response Body',
        copyResponse: 'Copy Response',
        downloadResponse: 'Download Response',
        noResponse: 'Send a request to see the response here',
        noHistory: 'No request history yet',
        noPresets: 'No saved presets yet',
        savePreset: 'Save as Preset',
        loadPreset: 'Load Preset',
        deletePreset: 'Delete Preset',
        presetName: 'Preset Name',
        enterValidUrl: 'Please enter a valid URL',
        requestSent: 'Request sent successfully',
        requestFailed: 'Request failed',
        responseCopied: 'Response copied to clipboard',
        presetSaved: 'Preset saved successfully',
        presetLoaded: 'Preset loaded successfully',
        presetDeleted: 'Preset deleted successfully'
      },
      timestampConverter: {
        name: 'Timestamp Converter',
        description: 'Convert between Unix timestamps and human-readable dates with timezone support',
        currentTime: 'Current Time',
        currentTimeDesc: 'Real-time current timestamp and date',
        timestampToDate: 'Timestamp to Date',
        timestampToDateDesc: 'Convert Unix timestamp to human-readable date',
        dateToTimestamp: 'Date to Timestamp',
        dateToTimestampDesc: 'Convert date string to Unix timestamp',
        timestampInput: 'Unix Timestamp',
        timestampPlaceholder: 'Enter Unix timestamp (seconds or milliseconds)...',
        dateInput: 'Date String',
        datePlaceholder: 'Enter date (YYYY-MM-DD HH:mm:ss or ISO format)...',
        timezone: 'Timezone',
        format: 'Format',
        unixTimestamp: 'Unix Timestamp',
        humanReadable: 'Human Readable',
        useCurrentTimestamp: 'Use Current Timestamp',
        useCurrentDateTime: 'Use Current Date/Time',
        errors: {
          emptyTimestamp: 'Please enter a timestamp',
          invalidTimestamp: 'Invalid timestamp format',
          emptyDate: 'Please enter a date',
          invalidDate: 'Invalid date format',
          conversionFailed: 'Conversion failed'
        }
      },
      regexTester: {
        name: 'Regex Tester',
        description: 'Test and validate regular expressions with real-time matching, group capture, and detailed explanations',
        pattern: 'Regular Expression Pattern',
        patternDesc: 'Enter your regular expression pattern to test',
        patternPlaceholder: 'Enter regex pattern (e.g., \\d{3}-\\d{3}-\\d{4})',
        testString: 'Test String',
        testStringDesc: 'Enter the text you want to test against your regex pattern',
        testStringPlaceholder: 'Enter text to test against the regex pattern...',
        results: 'Test Results',
        resultsDesc: 'View matches, capture groups, and highlighted text',
        matches: 'matches',
        match: 'Match',
        position: 'Position',
        captureGroups: 'Capture Groups',
        namedGroups: 'Named Groups',
        highlightedText: 'Highlighted Text',
        matchDetails: 'Match Details',
        noMatches: 'No matches found for the current pattern and test string',
        flags: {
          title: 'Regex Flags',
          description: 'Configure regex behavior with flags',
          globalDesc: 'Find all matches (not just the first)',
          ignoreCaseDesc: 'Case-insensitive matching',
          multilineDesc: '^$ match line breaks',
          dotAllDesc: '. matches newlines',
          unicodeDesc: 'Full unicode support',
          stickyDesc: 'Match from lastIndex only'
        }
      },
      pcapAnalyzer: {
        name: 'Network Packet Analyzer',
        description: 'Upload and analyze PCAP files to visualize network packet structures, protocols, and payload data with BPF filtering support',
        title: 'Network Packet Structure Viewer',
        subtitle: 'Upload and analyze PCAP files to visualize network packet structures and protocols',
        upload: {
          title: 'Upload PCAP File',
          dropZone: 'Drop the PCAP file here',
          browseFiles: 'Drag and drop a PCAP file here, or click to select',
          selectFile: 'Select File',
          supportedFormats: 'Supported formats: .pcap, .cap, .pcapng',
          maxSize: 'max 50MB',
          processing: 'Processing PCAP file...',
          pleaseWait: 'Please wait while we parse the packet data',
          processed: 'Processed',
          packets: 'packets',
          errors: 'Errors',
          time: 'Time',
          invalidFileType: 'Invalid file type. Please upload a PCAP file (.pcap, .cap, .pcapng)',
          fileTooLarge: 'File too large. Maximum size is 50MB',
          largeFileWarning: 'For better performance, consider splitting large PCAP files using these commands:'
        },
        filters: {
          title: 'Packet Filter',
          placeholder: 'Enter BPF filter expression (e.g., host 192.168.1.1 and port 80)',
          expression: 'BPF Filter Expression',
          apply: 'Apply',
          clear: 'Clear',
          showing: 'Showing',
          of: 'of',
          packets: 'packets',
          filtered: 'Filtered',
          active: 'Active',
          syntax: 'BPF Filter Syntax',
          examples: 'BPF Filter Examples:\n• tcp port 80 - HTTP traffic\n• host 192.168.1.1 - Specific host\n• icmp - ICMP packets only\n• src net 10.0.0.0/8 - Source from 10.x.x.x network',
          quickFilters: 'Quick Filters',
          activeFilter: 'Active Filter'
        },
        packetList: {
          title: 'Packet List',
          noPackets: 'No packets to display',
          uploadPrompt: 'Upload a PCAP file to start analyzing packets',
          length: 'Length',
          payload: 'Payload',
          bytes: 'bytes'
        },
        packetDetails: {
          title: 'Packet Details',
          noPacketSelected: 'No packet selected',
          selectPacket: 'Select a packet from the list to view details',
          summary: 'Packet Summary',
          timestamp: 'Timestamp',
          size: 'Size',
          protocol: 'Protocol',
          totalLength: 'Total Length',
          ethernetHeader: 'Ethernet Header',
          ipHeader: 'IP Header',
          tcpHeader: 'TCP Header',
          udpHeader: 'UDP Header',
          payload: 'Payload',
          showFull: 'Show Full',
          noPayloadData: 'No payload data',
          sourceMac: 'Source MAC',
          destMac: 'Destination MAC',
          etherType: 'EtherType',
          sourceIp: 'Source IP',
          destIp: 'Destination IP',
          version: 'Version',
          headerLength: 'Header Length',
          ttl: 'TTL',
          checksum: 'Checksum',
          sourcePort: 'Source Port',
          destPort: 'Destination Port',
          sequenceNumber: 'Sequence Number',
          acknowledgment: 'Acknowledgment',
          windowSize: 'Window Size',
          flags: 'Flags',
          length: 'Length',
          hex: 'Hex',
          ascii: 'ASCII',
          both: 'Both'
        },
        stats: {
          title: 'Analysis Summary',
          totalPackets: 'Total Packets',
          fileSize: 'File Size',
          processingTime: 'Processing Time',
          protocols: 'Protocols',
          protocolDistribution: 'Protocol Distribution'
        },
        errors: {
          processingFailed: 'Failed to process PCAP file',
          parsingErrors: 'Parsing completed with errors. Some packets may be missing or corrupted',
          invalidFile: 'Invalid PCAP file: magic number mismatch',
          filterError: 'Filter error',
          unknownError: 'An unknown error occurred'
        },
        emptyState: {
          title: 'Ready to Analyze',
          description: 'Upload a PCAP file to start analyzing network packets. The tool supports detailed protocol inspection, BPF filtering, and payload visualization.'
        }
      }
    }
  },
  zh: {
    common: {
      title: 'IT 工具集',
      subtitle: '专业 IT 工具集合',
      description: '现代化、强大且易于使用的开发者和系统管理员工具',
      home: '首页',
      tools: '工具',
      toggleTheme: '切换主题',
      toggleLanguage: '切换语言',
      copy: '复制',
      paste: '粘贴',
      clear: '清空',
      reset: '重置',
      generate: '生成',
      convert: '转换',
      compare: '比较',
      calculate: '计算',
      encode: '编码',
      decode: '解码',
      input: '输入',
      output: '输出',
      result: '结果',
      success: '成功',
      error: '错误',
      copied: '已复制',
      github: '在 GitHub 上查看',
      search: '搜索工具...',
      searchPlaceholder: '按工具名称或描述搜索',
      suggestNewTool: '建议增加新工具',
      noToolsFound: '未找到匹配的工具',
      privacyNotice: '隐私声明',
      privacyDescription: '所有数据处理均在您的浏览器本地进行。不会向我们的服务器传输任何数据，确保您的隐私和安全。'
    },
    categories: {
      hash: '哈希与编码',
      generator: '生成器',
      converter: '转换器',
      diff: '对比工具',
      network: '网络工具',
      'data-processing': '数据处理'
    },
    tools: {
      textHash: {
        name: '文本哈希',
        description: '将文本转换为各种哈希算法（MD5、SHA1、Base64等）',
        placeholder: '输入要哈希的文本...'
      },
      uuidGenerator: {
        name: 'UUID 生成器',
        description: '生成不同版本（v1、v4）和数量的UUID',
        generateMultiple: '批量生成',
        version: '版本',
        quantity: '数量'
      },
      textDiff: {
        name: '文本对比',
        description: '比较两个文本字符串并高亮显示差异',
        original: '原始文本',
        modified: '修改后文本'
      },
      jsonDiff: {
        name: 'JSON 对比',
        description: '比较JSON对象并显示结构化差异',
        originalJson: '原始 JSON',
        modifiedJson: '修改后 JSON'
      },
      jsonXmlConverter: {
        name: 'JSON ↔ XML',
        description: 'JSON和XML格式双向转换',
        jsonToXml: 'JSON 转 XML',
        xmlToJson: 'XML 转 JSON'
      },
      urlEncoder: {
        name: 'URL 编码/解码',
        description: '正确格式化编码和解码URL',
        urlToEncode: '待编码URL',
        urlToDecode: '待解码URL'
      },
      yamlTomlConverter: {
        name: 'YAML ↔ TOML',
        description: '在YAML和TOML格式之间转换，支持语法高亮和验证。支持复杂数据结构、数组和嵌套对象，提供可自定义的格式化选项。',
        yamlToToml: 'YAML 转 TOML',
        tomlToYaml: 'TOML 转 YAML'
      },
      subnetCalculator: {
        name: '子网计算器',
        description: '计算网络子网、CIDR和IP范围',
        ipAddress: 'IP 地址',
        subnetMask: '子网掩码',
        cidrNotation: 'CIDR 表示法'
      },
      qrGenerator: {
        name: '二维码生成器',
        description: '从文本或URL生成二维码，支持自定义颜色和错误纠正级别',
        inputText: '文本或网址',
        inputPlaceholder: '输入文本或网址生成二维码...',
        foregroundColor: '前景色',
        backgroundColor: '背景色',
        errorCorrectionLevel: '错误纠正级别',
        generate: '生成二维码',
        download: '下载二维码',
        success: '成功',
        error: '错误',
        generateSuccess: '二维码生成成功',
        generateError: '二维码生成失败',
        downloadSuccess: '二维码下载成功',
        emptyInputError: '请输入文本或网址',
        noQrCodeError: '请先生成二维码',
        errorLevel: {
          L: 'L (~7% 恢复)',
          M: 'M (~15% 恢复)',
          Q: 'Q (~25% 恢复)',
          H: 'H (~30% 恢复)'
        }
      },
      dnsQuery: {
        name: 'DNS 查询工具',
        description: '使用 DoH（DNS over HTTPS）查询 DNS 记录',
        domain: '域名',
        domainPlaceholder: '输入域名（例如：example.com）',
        recordType: '记录类型',
        provider: 'DoH 提供商',
        query: '查询 DNS',
        querying: '查询中...',
        querySettings: '查询设置',
        querySettingsDescription: '配置您的 DNS 查询参数',
        results: '查询结果',
        answers: '应答记录',
        authority: '权威记录',
        additional: '附加记录',
        authenticated: 'DNSSEC 已验证',
        noRecords: '未找到记录',
        querySuccess: 'DNS 查询成功完成',
        queryError: 'DNS 记录查询失败',
        queryFailed: '查询失败，状态码',
        emptyDomainError: '请输入域名',
        invalidDomainError: '请输入有效的域名',
        unknownError: '发生未知错误',
        statusCodes: {
          '1': '格式错误',
          '2': '服务器故障',
          '3': '域名不存在 (NXDOMAIN)',
          '4': '未实现',
          '5': '拒绝'
        }
      },
      xmlValidator: {
        name: 'XML验证器',
        description: '使用XSD模式验证XML文档，提供详细的错误报告',
        title: 'XML验证器',
        xsdSchema: 'XSD模式',
        xmlDocument: 'XML文档',
        textInput: '文本输入',
        fileUpload: '文件上传',
        xsdPlaceholder: '在此粘贴您的XSD模式...',
        xmlPlaceholder: '在此粘贴您的XML文档...',
        uploadXsd: '点击上传XSD文件',
        uploadXml: '点击上传XML文件',
        validate: '验证XML',
        validating: '验证中...',
        clearAll: '清空全部',
        validationResults: '验证结果',
        valid: '有效',
        invalid: '无效',
        issuesFound: '个问题',
        error: '错误',
        warning: '警告',
        line: '行',
        column: '列'
      },
      mermaidRenderer: {
        name: 'Mermaid图表渲染器',
        description: '创建和渲染Mermaid图表，支持语法高亮和模板',
        controls: '控制面板',
        controlsDesc: '选择模板并管理您的图表',
        template: '模板',
        editor: '代码编辑器',
        editorDesc: '编辑您的Mermaid图表代码',
        preview: '预览',
        previewDesc: '图表实时预览',
        fullWidthPreview: '全宽预览',
        syntaxHighlight: '语法高亮',
        codePlaceholder: '在此输入您的Mermaid图表代码...',
        copyCode: '复制代码',
        downloadSvg: '下载SVG',
        reset: '重置',
        fullWidth: '全宽显示',
        normalWidth: '正常宽度',
        rendering: '渲染中',
        rendered: '已渲染',
        renderError: '渲染错误',
        noPreview: '输入代码以查看预览',
        copySuccess: '代码已复制',
        copySuccessDesc: 'Mermaid代码已复制到剪贴板',
        copyError: '复制失败',
        copyErrorDesc: '复制代码到剪贴板失败',
        downloadSuccess: '下载完成',
        downloadSuccessDesc: 'SVG文件下载成功'
      },
      httpRequestBuilder: {
        name: 'HTTP请求构建器',
        description: '构建和发送HTTP请求，支持自定义请求头、请求体，并查看格式化响应',
        request: '请求',
        response: '响应',
        history: '历史记录',
        presets: '预设',
        method: '请求方法',
        url: 'URL',
        urlPlaceholder: '输入请求URL...',
        headers: '请求头',
        addHeader: '添加请求头',
        key: '键',
        value: '值',
        body: '请求体',
        bodyPlaceholder: '输入请求体...',
        contentType: '内容类型',
        send: '发送请求',
        sending: '发送中...',
        status: '状态',
        responseTime: '响应时间',
        responseSize: '大小',
        responseHeaders: '响应头',
        responseBody: '响应体',
        copyResponse: '复制响应',
        downloadResponse: '下载响应',
        noResponse: '发送请求以查看响应',
        noHistory: '暂无请求历史记录',
        noPresets: '暂无保存的预设',
        savePreset: '保存为预设',
        loadPreset: '加载预设',
        deletePreset: '删除预设',
        presetName: '预设名称',
        enterValidUrl: '请输入有效的URL',
        requestSent: '请求发送成功',
        requestFailed: '请求发送失败',
        responseCopied: '响应已复制到剪贴板',
        presetSaved: '预设保存成功',
        presetLoaded: '预设加载成功',
        presetDeleted: '预设删除成功'
      },
      timestampConverter: {
        name: '时间戳转换器',
        description: '在Unix时间戳和人类可读日期之间转换，支持时区设置',
        currentTime: '当前时间',
        currentTimeDesc: '实时显示当前时间戳和日期',
        timestampToDate: '时间戳转日期',
        timestampToDateDesc: '将Unix时间戳转换为人类可读日期',
        dateToTimestamp: '日期转时间戳',
        dateToTimestampDesc: '将日期字符串转换为Unix时间戳',
        timestampInput: 'Unix时间戳',
        timestampPlaceholder: '输入Unix时间戳（秒或毫秒）...',
        dateInput: '日期字符串',
        datePlaceholder: '输入日期（YYYY-MM-DD HH:mm:ss 或 ISO格式）...',
        timezone: '时区',
        format: '格式',
        unixTimestamp: 'Unix时间戳',
        humanReadable: '人类可读格式',
        useCurrentTimestamp: '使用当前时间戳',
        useCurrentDateTime: '使用当前日期时间',
        errors: {
          emptyTimestamp: '请输入时间戳',
          invalidTimestamp: '无效的时间戳格式',
          emptyDate: '请输入日期',
          invalidDate: '无效的日期格式',
          conversionFailed: '转换失败'
        }
      },
      regexTester: {
        name: '正则表达式测试器',
        description: '测试和验证正则表达式，支持实时匹配、分组捕获和详细说明',
        pattern: '正则表达式模式',
        patternDesc: '输入您要测试的正则表达式模式',
        patternPlaceholder: '输入正则表达式模式（例如：\\d{3}-\\d{3}-\\d{4}）',
        testString: '测试字符串',
        testStringDesc: '输入要与正则表达式模式匹配的文本',
        testStringPlaceholder: '输入要与正则表达式模式匹配的文本...',
        results: '测试结果',
        resultsDesc: '查看匹配项、捕获组和高亮文本',
        matches: '个匹配',
        match: '匹配',
        position: '位置',
        captureGroups: '捕获组',
        namedGroups: '命名组',
        highlightedText: '高亮文本',
        matchDetails: '匹配详情',
        noMatches: '当前模式和测试字符串未找到匹配项',
        flags: {
          title: '正则表达式标志',
          description: '使用标志配置正则表达式行为',
          globalDesc: '查找所有匹配项（不仅仅是第一个）',
          ignoreCaseDesc: '不区分大小写匹配',
          multilineDesc: '^$ 匹配换行符',
          dotAllDesc: '. 匹配换行符',
          unicodeDesc: '完整Unicode支持',
          stickyDesc: '仅从lastIndex开始匹配'
        }
      },
      pcapAnalyzer: {
        name: '网络数据包分析器',
        description: '上传和分析PCAP文件，可视化网络数据包结构、协议和载荷数据，支持BPF过滤',
        title: '网络数据包结构查看器',
        subtitle: '上传和分析PCAP文件，可视化网络数据包结构和协议',
        upload: {
          title: '上传PCAP文件',
          dropZone: '将PCAP文件拖放到此处',
          browseFiles: '拖拽PCAP文件到此处，或点击选择文件',
          selectFile: '选择文件',
          supportedFormats: '支持格式：.pcap, .cap, .pcapng',
          maxSize: '最大50MB',
          processing: '正在处理PCAP文件...',
          pleaseWait: '请稍候，我们正在解析数据包数据',
          processed: '已处理',
          packets: '个数据包',
          errors: '错误',
          time: '时间',
          invalidFileType: '无效的文件类型。请上传PCAP文件（.pcap, .cap, .pcapng）',
          fileTooLarge: '文件过大。最大大小为50MB',
          largeFileWarning: '为了更好的性能，建议使用以下命令分割大型PCAP文件：'
        },
        filters: {
          title: '数据包过滤器',
          placeholder: '输入BPF过滤表达式（例如：host 192.168.1.1 and port 80）',
          expression: 'BPF过滤表达式',
          apply: '应用',
          clear: '清除',
          showing: '显示',
          of: '共',
          packets: '个数据包',
          filtered: '已过滤',
          active: '活动',
          syntax: 'BPF过滤语法',
          examples: 'BPF过滤器示例：\n• tcp port 80 - HTTP流量\n• host 192.168.1.1 - 特定主机\n• icmp - 仅ICMP数据包\n• src net 10.0.0.0/8 - 来自10.x.x.x网络的源',
          quickFilters: '快速过滤器',
          activeFilter: '活动过滤器'
        },
        packetList: {
          title: '数据包列表',
          noPackets: '没有数据包可显示',
          uploadPrompt: '上传PCAP文件开始分析数据包',
          length: '长度',
          payload: '载荷',
          bytes: '字节'
        },
        packetDetails: {
          title: '数据包详情',
          noPacketSelected: '未选择数据包',
          selectPacket: '从列表中选择一个数据包查看详情',
          summary: '数据包摘要',
          timestamp: '时间戳',
          size: '大小',
          protocol: '协议',
          totalLength: '总长度',
          ethernetHeader: '以太网头部',
          ipHeader: 'IP头部',
          tcpHeader: 'TCP头部',
          udpHeader: 'UDP头部',
          payload: '载荷',
          showFull: '显示完整',
          noPayloadData: '无载荷数据',
          sourceMac: '源MAC地址',
          destMac: '目标MAC地址',
          etherType: '以太网类型',
          sourceIp: '源IP地址',
          destIp: '目标IP地址',
          version: '版本',
          headerLength: '头部长度',
          ttl: 'TTL',
          checksum: '校验和',
          sourcePort: '源端口',
          destPort: '目标端口',
          sequenceNumber: '序列号',
          acknowledgment: '确认号',
          windowSize: '窗口大小',
          flags: '标志',
          length: '长度',
          hex: '十六进制',
          ascii: 'ASCII',
          both: '两者'
        },
        stats: {
          title: '分析摘要',
          totalPackets: '总数据包数',
          fileSize: '文件大小',
          processingTime: '处理时间',
          protocols: '协议',
          protocolDistribution: '协议分布'
        },
        errors: {
          processingFailed: 'PCAP文件处理失败',
          parsingErrors: '解析完成但有错误。某些数据包可能丢失或损坏',
          invalidFile: '无效的PCAP文件：魔数不匹配',
          filterError: '过滤器错误',
          unknownError: '发生未知错误'
        },
        emptyState: {
          title: '准备分析',
          description: '上传PCAP文件开始分析网络数据包。该工具支持详细的协议检查、BPF过滤和载荷可视化。'
        }
      }
    }
  }
};